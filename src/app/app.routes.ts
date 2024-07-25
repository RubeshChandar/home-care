import { Routes } from '@angular/router';
import { PatientsComponent } from './patients/patients.component';
import { CarersComponent } from './carers/carers.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patients', component: PatientsComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'carers', component: CarersComponent },
];
