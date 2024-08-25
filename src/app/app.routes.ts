import { Routes } from '@angular/router';
import { PatientsComponent } from './patients/patients.component';
import { CarersComponent } from './carers/carers.component';
import { ChatComponent } from './chat/chat.component';
import { PatientComponent } from './patients/patient/patient.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { authGuard } from './authentication/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patients', component: PatientsComponent, canActivate: [authGuard] },
  { path: 'patients/:id', component: PatientComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'carers', component: CarersComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthenticationComponent },
];
