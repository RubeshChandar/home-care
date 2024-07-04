import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent]
})
export class AppComponent {
  title = 'home-care';

  constructor(private firestore: AngularFirestore) {
    firestore.collection("Test").doc("Check").update({
      "Time": new Date(),
    })
  }
}
