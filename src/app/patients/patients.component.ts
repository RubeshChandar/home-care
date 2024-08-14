import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Patient } from '../models/patient.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { map } from 'rxjs';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent {
  patients: Patient[] = [];
  patientsCopy: Patient[] = [];
  allPatientsCheckbox = true;
  ph = "Please enter the name or email address to search...";
  date: string = "";

  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.patientSubject.subscribe(p => {
      this.patients = p;
      this.patientsCopy = [...this.patients];
    });
    this.date = this.getFormattedToday();
  }

  getFormattedToday(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase()
    this.patients = this.patientsCopy.filter((patient) => {
      return patient.name.toLowerCase().includes(value) || patient.email.toLowerCase().includes(value)
    })
  }

  getRequests() {
    this.firebaseService.getRequestsForParticularDate(this.date).pipe(
      map(col => {
        let temp: Patient[] = []
        this.resetPatients();
        col.unassigned.map(id => {
          temp.push(...this.patients.filter(patient => {
            if (patient.id === id) patient.assigned = false;
            return patient.id === id;
          }));
        })

        col.assigned.map(id => {
          temp.push(...this.patients.filter(patient => {
            if (patient.id === id) patient.assigned = true;
            return patient.id === id;
          }));
        })

        return temp;
      })
    ).subscribe(
      allRequests => {
        this.patients = allRequests;
        this.patientsCopy = allRequests;
      }
    );
  }

  resetPatients() {
    this.patients = this.firebaseService.patientSubject.value;
  }

  showAllPatients() {
    this.allPatientsCheckbox = !this.allPatientsCheckbox;
    if (this.allPatientsCheckbox) {
      this.resetPatients();
    }
    if (!this.allPatientsCheckbox) {
      this.getRequests();
    }
  }

  showUnassignedOnly(event: Event) {
    const value = (event.target as HTMLInputElement)
    if (value.checked) {
      this.patientsCopy = this.patientsCopy.filter((patient) => patient.assigned === false);
      this.patients = this.patientsCopy;
    } else {
      this.getRequests();
    }
  }

}
