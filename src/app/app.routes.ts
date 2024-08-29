import { Routes } from '@angular/router';
import { PatientsComponent } from './patients/patients.component';
import { CarersComponent } from './carers/carers.component';
import { PatientComponent } from './patients/patient/patient.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { authGuard } from './authentication/auth.guard';
import { CarerComponent } from './carers/carer/carer.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patients', component: PatientsComponent, canActivate: [authGuard] },
  { path: 'patients/:id', component: PatientComponent },
  { path: 'carers', component: CarersComponent, canActivate: [authGuard] },
  { path: 'carers/:id', component: CarerComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthenticationComponent },
];
