import { Component } from '@angular/core';
import { Carer } from '../models/carer.model';
import { FirebaseService } from '../firebase.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carers',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './carers.component.html',
  styleUrl: './carers.component.css'
})
export class CarersComponent {
  ph = "Search for a carer";
  carers: Carer[] = [];
  carersCopy: Carer[] = [];

  constructor(firebaseService: FirebaseService) {
    firebaseService.carerSubject.subscribe(
      carers => {
        this.carers = carers;
        this.carersCopy = carers
      }
    )
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.carers = this.carersCopy.filter((carer) => {
      return carer.name.toLowerCase().includes(value) || carer.email.toLowerCase().includes(value)
    })
  }
}
