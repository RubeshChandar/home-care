import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Patient } from '../models/patient.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent {
  patients: Patient[] = []
  ph = "Please enter the name or email address to search...";
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

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase()
    this.firebaseService.patientSubject.subscribe(
      p => this.patients = p.filter((patient) => {
        return patient.name.toLowerCase().includes(value) || patient.email.toLowerCase().includes(value)
      })
    )
  }

}
