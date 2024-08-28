import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Carer } from '../../models/carer.model';
import { FirebaseService } from '../../firebase.service';

@Component({
  selector: 'app-carer',
  standalone: true,
  imports: [],
  templateUrl: './carer.component.html',
  styleUrl: './carer.component.css'
})
export class CarerComponent implements OnInit {
  carerID: string = "";
  carer!: Carer;

  constructor(route: ActivatedRoute, private firebaseService: FirebaseService) {
    route.params.subscribe(c => this.carerID = c['id'])
  }

  ngOnInit() {
    this.firebaseService.carerSubject.subscribe(carer =>
      this.carer = carer.filter(c => c.id === this.carerID)[0]
    )
  }
}
