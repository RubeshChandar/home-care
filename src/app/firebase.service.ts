import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Patient } from './models/patient.model';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
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

  getRequestsForParticularDate(date: string) {
    const col1$ = this.firestore.collection(`requests/${date}/unassigned`).snapshotChanges()
      .pipe(map(snapshot => snapshot.map(data => data.payload.doc.id)));
    const col2$ = this.firestore.collection(`requests/${date}/assigned`).snapshotChanges()
      .pipe(map(snapshot => snapshot.map(data => data.payload.doc.id)));

    return combineLatest([col1$, col2$]).pipe(map(([ids1, ids2]) => {
      return { "unassigned": ids1, "assigned": ids2 }
    }))
  }

}
