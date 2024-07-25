import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "./header/header.component";
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, RouterOutlet]
})
export class AppComponent {
  title = 'home-care';

  constructor(private firebaseService: FirebaseService) { }
}
