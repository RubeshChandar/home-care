import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Carer } from '../../models/carer.model';
import { FirebaseService } from '../../firebase.service';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from "../../shared/time-format.pipe";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-carer',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './carer.component.html',
  styleUrl: './carer.component.css'
})
export class CarerComponent implements OnInit {
  carerID: string = "";
  carer!: Carer;

  constructor(
    route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private sanitizer: DomSanitizer
  ) {
    window.scrollTo(0, 0);
    route.params.subscribe(c => this.carerID = c['id'])
  }

  ngOnInit() {
    this.firebaseService.carerSubject.subscribe(carer =>
      this.carer = carer.filter(c => c.id === this.carerID)[0]
    )
  }

  getLoc() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps?q=${this.carer.location.latitude},${this.carer.location.longitude}&hl=es;z=0&output=embed`);
  }
}
