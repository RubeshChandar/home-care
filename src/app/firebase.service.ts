import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Patient } from './models/patient.model';
import { Assigned, Requests, UnAssigned } from './models/requests.model';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Carer } from './models/carer.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  patientSubject = new BehaviorSubject<Patient[]>([]);
  carerSubject = new BehaviorSubject<Carer[]>([]);
  isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private firestore: AngularFirestore, private functions: AngularFireFunctions) {
    this.getPatients();
    this.getCarers();
  }

  getCarers() {
    this.isLoadingSubject.next(true);
    this.firestore.collection("carer").valueChanges({ idField: 'id' })
      .pipe(
        map(data => {
          return data.map(
            carer => {
              return {
                'id': carer.id,
                ...carer as Carer
              }
            }
          )
        })
      ).subscribe(
        data => {
          this.carerSubject.next(data);
          this.isLoadingSubject.next(false);
        }
      )
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
          this.patientSubject.next(data);
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

  private requestHelper(date: string, id: string, assigned: boolean) {
    return this.firestore.collection(`requests/${date}/${(assigned) ? 'assigned' : 'unassigned'}`).doc(id).get()
      .pipe(
        map(data => {
          if (data.data() === undefined) return
          return (data.data() as { 'requested': [Requests] }).requested
            .map(indReq => {
              return ({ ...indReq, assigned: assigned, date: date });
            })
        })
      )
  }

  getRequestsForOnePatients(id: string, assigned: boolean) {
    return this.firestore.collection(`patient/${id}/dates`).valueChanges({ idField: 'date' })
      .pipe(map(async result => {
        let temp: UnAssigned[] | Assigned[] = []
        return await new Promise<UnAssigned[] | Assigned[]>(resolve => {
          result.forEach(data => {
            this.requestHelper(data.date, id, assigned)
              .subscribe(data => {
                data?.forEach((d) => temp.push(d));
                resolve(temp);
              })
          })
        })
      })
      )
  }

  getAvailability(req: UnAssigned) {
    return this.functions.httpsCallable("getAvailableCarers")(req);
  }

  async getSpecialists() {
    let specialists;
    await new Promise<void>(res => {
      this.firestore.collection("misc").doc("specialists").get()
        .subscribe(special => {
          specialists = special.data();
          res();
        })
    })
    return specialists;
  }

  assignCarer(carer: Carer, patientID: string, req: UnAssigned) {
    return this.functions.httpsCallable("assignCarer")({ "carerID": carer.id, "carerName": carer.name, "patientID": patientID, ...req })
  }

  deassignCarer(req: any) {
    return this.functions.httpsCallable("deleteCarer")(req)
  }

}
