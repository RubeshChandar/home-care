import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../firebase.service';
import { Patient } from '../../models/patient.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DateTimePickerComponent } from "../../shared/date-time-picker/date-time-picker.component";
import { Requests } from '../../models/requests.model';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, DateTimePickerComponent],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {
  patientId: string = "";
  patient?: Patient;
  subscriptions = new Subscription();
  requestToggle = true;
  showSnack = false;
  message = "";
  color = "black";

  constructor(private route: ActivatedRoute,
    private firebaseService: FirebaseService) {
    window.scrollTo(0, 0);
    this.subscriptions.add(
      route.params.subscribe(param => {
        this.patientId = param['id']
      })
    )
  }

  ngOnInit() {
    this.subscriptions.add(
      this.firebaseService.patientSubject.subscribe(patient =>
        this.patient = patient.filter(p => p.id === this.patientId)[0]
      )
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  snackIT(message: string, color: string) {
    this.color = color;
    this.showSnack = true;
    this.message = message;
    setTimeout(() => {
      this.showSnack = false;
    }, 5000)
  }

  check(req: Requests) {
    this.firebaseService.addRequest(this.patientId, req).subscribe(
      e => {
        switch (e) {
          case "Success":
            this.requestToggle = false;
            this.snackIT("Successfully added the request", "#8CBA44");
            break;
          case "Overlap":
            console.log("Overlap");
            this.snackIT("Overlap so request not added", "#fb8828");
            break;
          case "Failure":
            this.requestToggle = false;
            this.snackIT("Some error occured!!!!", "red")
            break;
        }
      }
    )
  }
}
