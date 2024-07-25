import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Patient } from '../models/patient.model';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent {
  patients: Patient[] = []

  constructor(private firebaseService: FirebaseService, private functions: AngularFireFunctions) {
    firebaseService.patient.subscribe(
      p => this.patients = p
    )
  }

  details(id: string) {
    console.log(id)
    // const fn = this.functions.httpsCallable("sayHello");
    // fn({ "name": "Raj" }).subscribe(e =>
    //   console.log(e)
    // )
  }

}
