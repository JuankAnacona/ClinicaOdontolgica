import { Routes } from '@angular/router';
import { RegisterComponent } from './app/components/sharedPortals/registerComponent/register.component';
import { EmailVerfiedComponent } from './app/components/sharedPortals/email-verfied/email-verfied.component';
import { RegisterCompletedComponent } from './app/components/sharedPortals/register-completed/register-completed.component';
import { LoginWorkersComponent } from './app/components/workersPortal/login-workers/login-workers.component';
import { LoginComponent } from './app/components/patientPortal/loginComponent/login.component';
export const routes: Routes = [
    { path: 'PortalPaciente', 
  children: [
    {path: 'LoginPaciente', component: LoginComponent},
  ]},
  { path: 'PortalEmpleado',
  children: [
    {path: 'LoginEmpleado', component: LoginWorkersComponent}
    
    
  ]
  },
  { path: 'Portales', children:[
    {path: 'Registro', component: RegisterComponent}
    ,{path: 'RegistroCompletado', component: RegisterCompletedComponent}
    ,{ path: 'CorreoVerificado', component: EmailVerfiedComponent}

  ]}
];
