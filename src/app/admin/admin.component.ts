import { Component } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  name = ""
  email = ""
  password = ""
  uid = undefined
  admin = false
  warnMsg = ""

  constructor(private functions: AngularFireFunctions) { }

  createAdmin() {
    this.functions.httpsCallable("createUser")({
      email: this.email, password: this.password, displayName: this.name, role: this.admin ? "admin" : "carer"
    }).subscribe(u => {
      this.warnMsg = u.message;
    })
  }
}
