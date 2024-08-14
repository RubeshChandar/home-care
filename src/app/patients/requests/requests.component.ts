import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { FirebaseService } from '../../firebase.service';
import { Assigned, UnAssigned } from '../../models/requests.model';
import { TimeFormatPipe } from "../../shared/time-format.pipe";
import { DateFormatPipe } from "../../shared/date-format.pipe";

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [TimeFormatPipe, DateFormatPipe],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit, OnDestroy {
  @Input() patientID!: string;
  unAssignedRequests?: UnAssigned[] = [];
  assignedRequests?: Assigned[] = [];
  unSubscribe: Subject<void> = new Subject();

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

  assign(date: string) {
    this.firebaseServices.getAvailability(date)
  }

}
