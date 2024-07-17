import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Patient } from './models/patient.model';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  patient = new BehaviorSubject<Patient[]>([]);

  constructor(private firestore: AngularFirestore) {

    firestore.collection("patient").valueChanges({ idField: 'id' })
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
          this.patient.next(data)
        }
      )

  }

}
