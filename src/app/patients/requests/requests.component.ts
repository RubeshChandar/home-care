import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';

import { FirebaseService } from '../../firebase.service';
import { Assigned, UnAssigned } from '../../models/requests.model';
import { TimeFormatPipe } from "../../shared/time-format.pipe";
import { DateFormatPipe } from "../../shared/date-format.pipe";
import { Carer, Schedule } from '../../models/carer.model';
import { matchCarerPatient } from './sort-function';
import { Patient } from '../../models/patient.model';
import { CommaSeparatedPipe } from "../../shared/comma-separated.pipe";

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [TimeFormatPipe, DateFormatPipe, CommaSeparatedPipe],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit, OnDestroy {
  @Input() patientID!: string;
  @Input() patient?: Patient;
  @Input() snack!: Function;
  unAssignedRequests?: UnAssigned[] = [];
  assignedRequests?: Assigned[] = [];
  carersList?: Carer[] = [];
  unSubscribe: Subject<void> = new Subject();
  openAssignDialog = false;
  selectedReq?: UnAssigned;
  buttonDisabled = false;

  currentIndex: number = 0;
  itemsPerView: number = 4; // Number of cards per view

  constructor(private firebaseServices: FirebaseService) { }

  scroll(direction: number): void {
    const numCards = this.unAssignedRequests!.length;
    // Calculate new index with wrapping
    this.currentIndex = (this.currentIndex + direction + numCards) % numCards;
  }

  ngOnInit() {

    this.firebaseServices.getRequestsForOnePatients(this.patientID, false)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(promise => promise.then(unAssignedRequests =>
        this.unAssignedRequests = unAssignedRequests
      ))

    this.firebaseServices.getRequestsForOnePatients(this.patientID, true)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(promise => promise.then(assignedRequests =>
        this.assignedRequests = assignedRequests
      ))
    if (this.firebaseServices.role === "carer") this.buttonDisabled = true
  }

  ngOnDestroy() {
    this.unSubscribe.next();
    this.unSubscribe.unsubscribe();
  }

  getTransform(): string {
    return `translateX(-${this.currentIndex * (100 / this.itemsPerView)}%)`;
  }

  getColor(date: string): string {
    switch (this.compareDates(date)) {
      case "UPCOMING":
        return "#9a77ef";
      case "PAST":
        return "#32d54f";
      default:
        return "Yellow";
    }
  }

  getTagColor(rank: number): string {
    if (rank < 10) return "green";
    if (rank < 20) return "#9a77ef";
    return "red";
  }

  compareDates(dateString: string): string {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Convert both date strings to Date objects
    const inputDate = new Date(dateString);
    const todayDate = new Date(todayString);

    // Compare the two dates
    if (todayDate > inputDate) {
      return 'PAST';
    } else if (todayDate < inputDate) {
      return 'UPCOMING';
    } else {
      return 'TODAY';
    }
  }

  openAssignment(req: UnAssigned) {
    this.selectedReq = req;
    this.firebaseServices.isLoadingSubject.next(true);
    this.openAssignDialog = true;
    this.firebaseServices.getAvailability({ ...req, id: this.patientID })
      .pipe(map((carers: Carer[]) => matchCarerPatient(this.patient!, carers, this.firebaseServices)))
      .subscribe(carers => {
        carers.then(carers => this.carersList = carers)
        this.firebaseServices.isLoadingSubject.next(false);
      })
  }

  assign(carer: Carer) {
    this.firebaseServices.assignCarer(carer, this.patientID, this.selectedReq!)
      .subscribe(e => {
        if (e === "Done") {
          this.openAssignDialog = false;
          this.snack(`${carer.name} has been successfully assigned`, "Green")
        }
      })
  }

  getCarerSchedule(carer: Carer) {
    const date = new Date(this.selectedReq!.date);
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const schedule = carer.schedule[daysOfWeek[date.getDay()] as keyof Schedule];
    return { "start": schedule![0], "end": schedule![1] }
  }

  deleteAssignment(req: Assigned) {
    this.firebaseServices.deassignCarer({ ...req, patientID: this.patientID })
      .subscribe(e => { if (e === "done") this.snack(`${req.carerName} has now been removed`, "red") })
  }

}
