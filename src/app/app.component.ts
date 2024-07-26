import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "./header/header.component";
import { FirebaseService } from './firebase.service';
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, RouterOutlet, LoadingSpinnerComponent]
})
export class AppComponent {
  title = 'home-care';
  isLoading = false;

  constructor(private firebaseService: FirebaseService) {
    firebaseService.isLoadingSubject.subscribe(
      bol => this.isLoading = bol
    )
  }
}
