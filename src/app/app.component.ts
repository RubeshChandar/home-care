import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "./header/header.component";
import { FirebaseService } from './firebase.service';
import { LoadingSpinnerComponent } from "./shared/loading-spinner/loading-spinner.component";
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    HeaderComponent,
    RouterOutlet,
    LoadingSpinnerComponent,
    AngularFireFunctionsModule,
  ]
})
export class AppComponent {
  title = 'home-care';
  isLoading = false;

  constructor(firebaseService: FirebaseService) {
    firebaseService.isLoadingSubject.subscribe(
      bol => this.isLoading = bol
    )
  }
}
