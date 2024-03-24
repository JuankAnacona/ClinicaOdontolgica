import { Routes } from '@angular/router';
import { RegisterComponent } from './app/components/sharedPortals/registerComponent/register.component';
import { EmailVerfiedComponent } from './app/components/sharedPortals/email-verfied/email-verfied.component';
import { RegisterCompletedComponent } from './app/components/sharedPortals/register-completed/register-completed.component';
import { LoginWorkersComponent } from './app/components/workersPortal/login-workers/login-workers.component';
import { LoginComponent } from './app/components/patientPortal/loginComponent/login.component';
import { AppointmentsComponent } from './app/components/workersPortal/Management/appointments/appointments.component';
import { PatientsComponent } from './app/components/workersPortal/Management/patients/patient-list/patients.component';
import { HistoryPatientsComponent } from './app/components/workersPortal/Management/patients/patient-list/history-patients/history-patients.component';

export const routes: Routes = [
    { path: 'PortalPaciente', 
  children: [
    {path: 'LoginPaciente', component: LoginComponent},
  ]},
  { path: 'PortalEmpleado',
  children: [
    {path: 'LoginEmpleado', component: LoginWorkersComponent},
    {path: 'Gestion', children: [
      {path: 'Citas', component: AppointmentsComponent},
      {path: 'Pacientes',
      children: [
        { path: 'ListarPacientes', component: PatientsComponent},
        {path: 'HistorialClinico/:idpatient', component: HistoryPatientsComponent  }
      ]}
    ]}
  ]
  },
  { path: 'Portales', children:[
    {path: 'Registro', component: RegisterComponent}
    ,{path: 'RegistroCompletado', component: RegisterCompletedComponent}
    ,{ path: 'CorreoVerificado', component: EmailVerfiedComponent}

  ]}
];
