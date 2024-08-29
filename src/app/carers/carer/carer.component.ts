import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Carer } from '../../models/carer.model';
import { FirebaseService } from '../../firebase.service';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from "../../shared/time-format.pipe";
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../models/patient.model';

type Point = {
  lat: number;
  lng: number;
}

type Booking = {
  endTime: number,
  startTime: number,
  patient: string
}

function getBookingsWithPatientDetails(bookings: Booking[], patients: Patient[]): (Booking & { patientDetails: Patient })[] {
  return bookings
    .map(booking => {
      const patientDetails = patients.find(patient => patient.id === booking.patient);
      return patientDetails ? { ...booking, patientDetails } : null;
    })
    .filter(booking => booking !== null) as (Booking & { patientDetails: Patient })[];
}

@Component({
  selector: 'app-carer',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe, GoogleMapsModule, FormsModule],
  templateUrl: './carer.component.html',
  styleUrl: './carer.component.css'
})
export class CarerComponent implements OnInit {
  carerID: string = "";
  carer!: Carer;
  home: Point = { lat: 0, lng: 0 };
  options: google.maps.MapOptions = {
    mapId: "Home care",
    center: this.home,
    zoom: 10,
  };
  homeContent: any;
  selectedDate = "";
  warn = true;
  assignment: (Booking & { patientDetails: Patient })[] = []
  assignmentMarkers: Point[] = []

  constructor(
    route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    window.scrollTo(0, 0);
    route.params.subscribe(c => this.carerID = c['id'])
  }

  ngOnInit() {
    this.firebaseService.carerSubject.subscribe(carer => {
      this.carer = carer.filter(c => c.id === this.carerID)[0];
      this.getLoc()
    })
    const parser = new DOMParser();
    // this is an SVG string of a house icon, but feel free to use whatever SVG icon you'd like
    const svgString = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF5733" stroke="#FFFFFF" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
                    </svg>`;
    this.homeContent = parser.parseFromString(svgString, "image/svg+xml").documentElement;
  }

  getLoc() {
    this.home = { lat: this.carer.location.latitude, lng: this.carer.location.longitude };
    this.options.center! = this.home;
  }

  assignments() {
    this.firebaseService.getAssignment(this.selectedDate, this.carerID)
      .subscribe(booking => {
        if (booking.length === 0) {
          this.warn = true;
          this.assignment = [];
          this.assignmentMarkers = [];
        }
        else {
          this.warn = false;
          this.assignment = getBookingsWithPatientDetails(booking, this.firebaseService.patientSubject.value);
          this.assignment.map(b => {
            this.assignmentMarkers.push({
              lat: b.patientDetails.location.latitude,
              lng: b.patientDetails.location.longitude
            })
          })
        }
      })
  }

  takeme(patientID: string) {
    this.router.navigate([`/patients/${patientID}`])
  }

}
