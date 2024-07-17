import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  patients: Patient[] = []

  constructor(private firebaseService: FirebaseService) {
    firebaseService.patient.subscribe(
      p => this.patients = p
    )
  }

}
