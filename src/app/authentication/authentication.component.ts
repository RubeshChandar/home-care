import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


export function extractErrorMessage(error: any): string {
  // Check if the error is an object and has a 'message' property
  const errorMessage = typeof error === 'string' ? error : error.message || '';

  // Regex to extract the part of the error message
  const regex = /Firebase:\s(.*?)(?=\s\()/;
  const match = errorMessage.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    return 'Unknown error';
  }
}


@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  warnMsg = "";
  name = "";
  email = "";
  password = "";

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) { }

  submit(login: boolean) {
    if (this.email === "" || this.password === "") {
      this.warnMsg = "Email and Password can't be empty"
      return;
    }

    login ?

      this.firebaseAuth.signInWithEmailAndPassword(
        this.email, this.password
      ).then(
        res => {
          res.user?.updateProfile({
            displayName: this.name,
          })
          console.log(`${res.user?.displayName} has been signed in successfully`);
          this.router.navigate(['/patients'])
        }
      ).catch(e => this.warnMsg = extractErrorMessage(e))

      :

      this.firebaseAuth.createUserWithEmailAndPassword(
        this.email, this.password
      ).then(
        res => console.log(`${res.user?.displayName} has been created successfully`)
      ).catch(e => this.warnMsg = extractErrorMessage(e))
  }
}
