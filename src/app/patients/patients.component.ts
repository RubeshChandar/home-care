import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Patient } from '../models/patient.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent {
  patients: Patient[] = []

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    firebaseService.patientSubject.subscribe(
      p => this.patients = p
    )
  }

  details(id: string) {
    this.router.navigate([`./${id}`], { relativeTo: this.route });
  }

}
