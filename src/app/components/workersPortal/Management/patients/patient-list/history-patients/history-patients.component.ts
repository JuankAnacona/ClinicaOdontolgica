import { Component, Inject, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RestforAdminService } from '../../../../../../services/rest-for-admin';
import { concatMap, map } from 'rxjs';
import { IUser } from '../../../../../../models/user';
import { IAppoinment } from '../../../../../../models/appoiment';
import { CardAppointmentComponent } from '../../../appointments/card-appointment/card-appointment.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-history-patients',
  standalone: true,
  imports: [CardAppointmentComponent, RouterLink, RouterLinkActive],
  templateUrl: './history-patients.component.html',
  styleUrl: './history-patients.component.css'
})
export class HistoryPatientsComponent {

  @Inject (Router) private router: Router = inject(Router);
  @Inject (ActivatedRoute) private routerAct: ActivatedRoute = inject(ActivatedRoute);
  @Inject (RestforAdminService) private restSvc: RestforAdminService = inject(RestforAdminService);

  public patient: WritableSignal<IUser | null> = signal(null);
  public appointments: WritableSignal<IAppoinment[]> = signal([]);

  public format = format;

  async ngOnInit() {
  await this.routerAct.paramMap.pipe(
      map (params => params.get('idpatient')),
      concatMap( idpatient => this.restSvc.RecoveryClinicHistory(idpatient!)),
      map( res => res.data! as {patient:IUser,appointments:IAppoinment[]} )
   ).subscribe(
    res => {
      this.patient.set(res.patient);
      this.appointments.set(res.appointments);
    }
   );
}

 public colorAppointment(status: string, forCalendar: boolean = false){
    switch (status) {
      case 'Pendiente':
        return forCalendar ? 'bg-yellow-400' :'bg-white hover:bg-gray-100';
      case 'Cancelada':
        return forCalendar?  'bg-red-700':'bg-red-200';
      case 'Realizada-Asistió':
      case 'Realizada-No Asistió':
        return forCalendar ? 'bg-green-500':'bg-green-100';
      default:
        return forCalendar ? 'bg-yellow-400' :'bg-white hover:bg-gray-100';
    }
  }
}
