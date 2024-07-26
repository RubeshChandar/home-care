import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../firebase.service';
import { Patient } from '../../models/patient.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {
  patientId: string = "";
  patient!: Patient;
  subscriptions = new Subscription();

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) {
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

  // ngDoCheck() {
  //   if (this.patient === undefined) {
  //     this.firebaseService.isLoadingSubject.next(true);
  //   } else {
  //     this.firebaseService.isLoadingSubject.next(false);
  //   }
  // }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
