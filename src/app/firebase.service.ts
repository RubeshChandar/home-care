import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Patient } from './models/patient.model';
import { BehaviorSubject, map } from 'rxjs';
import { Requests } from './models/requests.model';
import { AngularFireFunctions } from '@angular/fire/compat/functions';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  patientsList: Patient[] = [];
  patientSubject = new BehaviorSubject<Patient[]>([]);
  isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private firestore: AngularFirestore, private functions: AngularFireFunctions) {
    this.getPatients();
  }

  getPatients() {
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

  addRequest(id: string, req: Requests) {
    return this.functions.httpsCallable("addRequest")({ id: id, ...req })
  }

}
