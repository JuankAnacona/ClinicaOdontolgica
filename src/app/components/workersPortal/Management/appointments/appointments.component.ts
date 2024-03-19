import { CommonModule } from '@angular/common';
import { Component, Inject, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { format, startOfToday, getHours } from 'date-fns';
import { SearchPatientsDirective } from '../../../../directives/searchpatients';
import { IAppoinment } from '../../../../models/appoiment';
import { IUser } from '../../../../models/user';
import { RestforAdminService } from '../../../../services/rest-for-admin';
import { AsideWorkerComponent } from '../../aside-worker/aside-worker.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ModalAppoitmentComponent } from './modal-appoitment/modal-appoitment.component';
import { CardAppointmentComponent } from './card-appointment/card-appointment.component';
import { TranslateDatePipe } from '../../../../pipes/translate-date.pipe';
@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, AsideWorkerComponent, 
    SearchPatientsDirective, CalendarComponent,ReactiveFormsModule, 
    ModalAppoitmentComponent, CardAppointmentComponent, TranslateDatePipe],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

@Inject (RestforAdminService) private restAdminSvc: RestforAdminService = inject(RestforAdminService);





public appointMentsofMonth : WritableSignal<IAppoinment[]> = signal([]);
public appointMentsofDay : Signal<IAppoinment[]> = computed(()=>{
  let day = format(this.selectedDay(), 'dd');
   
   return this.appointMentsofMonth().filter((appointment) => {
      return format(appointment.date, 'dd') === day;    
   });});

public today = startOfToday();
public selectedDay : WritableSignal<Date> = signal(this.today);

public getHours = getHours;
public format = format;





async ngOnInit() {
  await this.recoveryAppointments();
}
  async  recoveryAppointments()  {
    let datetoSearch = format(this.selectedDay(), 'yyyy-MM');
    await this.restAdminSvc.getMonthApoinments(datetoSearch).subscribe(respon => {
      console.log('respon', respon);
      this.appointMentsofMonth.set(respon.data) ;
      this.paintAppointments();
    });
  }

  private paintAppointment(appointment: IAppoinment){
  console.log('Entranndo a pintar cita');
      let numberday = format(appointment.date, 'd');
      let daysContainer = document.getElementById(`day-appts-${numberday}`);
      let dayContainer = document.createElement('div');
      dayContainer?.classList.add( this.colorAppointment(appointment.status,true), 'text-white', 'rounded', 'p-1', 'mb-1');
      let info = document.createElement('span');
      info.textContent = `${format(appointment.date, "HH")}:${format(appointment.date, "mm")} - ${appointment.ccpatient}`;
      dayContainer.appendChild(info);
      daysContainer?.appendChild(dayContainer);
  }

  

  private paintAppointments() {
    this.appointMentsofMonth().forEach(appointment => {
      this.paintAppointment(appointment);
    
    })
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
  


  public operateAppointment(idoffApp : string, operation: string){
    const data = [idoffApp, operation];
    this.restAdminSvc.operateAppointment(data).subscribe( resp => {
      console.log('resp', resp);
      if (resp.status === 'success') {
        let appointment = this.appointMentsofMonth().find((appointment) => appointment.id === idoffApp);
        // Despintar la cita en el calendario
      }
      this.selectedDay.set(this.selectedDay());
    });
  }


}
