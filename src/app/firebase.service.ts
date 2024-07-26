import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Patient } from './models/patient.model';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  patientsList: Patient[] = [];
  patientSubject = new BehaviorSubject<Patient[]>([]);
  isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private firestore: AngularFirestore) {
    this.getPatients();
  }

  async getPatients() {
    this.isLoadingSubject.next(true);

    this.firestore.collection("patient").valueChanges({ idField: 'id' })
      .pipe(
        map(data => {
          return data.map(
            patient => {
              return {
                'id': patient.id,
                ...patient as Patient
              }
            }
          )
        })
      ).subscribe(
        data => {
          this.patientsList = data;
          this.patientSubject.next(this.patientsList);
          this.isLoadingSubject.next(false);
        }
      )
  }

}
