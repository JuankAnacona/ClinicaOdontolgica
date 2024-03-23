import { CommonModule } from '@angular/common';
import { Component, Inject, Signal, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { format, startOfToday, getHours, parse } from 'date-fns';
import { SearchPatientsDirective } from '../../../../directives/searchpatients';
import { IAppoinment } from '../../../../models/appoiment';
import { IUser } from '../../../../models/user';
import { RestforAdminService } from '../../../../services/rest-for-admin';
import { AsideWorkerComponent } from '../../aside-worker/aside-worker.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ModalAppoitmentComponent } from './modal-appoitment/modal-appoitment.component';
import { CardAppointmentComponent } from './card-appointment/card-appointment.component';
import { TranslateDatePipe } from '../../../../pipes/translate-date.pipe';
import { MY_TOKEN_SERVICESTORAGE } from '../../../../services/injectiontokenstorageservices';
import { IStorageService } from '../../../../models/interfaceservicios';
import { LocalstorageService } from '../../../../services/localstorage.service';
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
@Inject (MY_TOKEN_SERVICESTORAGE) private storageSvc: IStorageService = inject(LocalstorageService);




public appMonth: IAppoinment[] = [];
public appointMentsofMonth : WritableSignal<IAppoinment[]> = signal([]);
public appointMentsofDay : Signal<IAppoinment[]> = computed(()=>{
  let day = format(this.selectedDay(), 'dd');
   
   return this.appMonth.filter((appointment) => {
      return format(appointment.date, 'dd') === day;    
   });});

public today = startOfToday();
public selectedDay : WritableSignal<Date> = signal(this.today);

public getHours = getHours;
public format = format;


constructor(){
  effect(() => {
    this.unPaintAppointments();
    this.appointMentsofMonth().forEach(appointment => {
      this.paintAppointment(appointment);
    });
  this.appMonth = this.appointMentsofMonth();
  });

}


async ngOnInit() {
  await this.callAppointmentfromRest(format(this.today, 'yyyy-MM'),true);
}

  async  recoveryAppointments(date: Date) : Promise<void>  {
    let datetoSearch = format(date, 'yyyy-MM');
    console.log('datetoSearch', datetoSearch);
    //Si el mes ya esta cargado en el localstorage
    if ( datetoSearch === format(this.today, 'yyyy-MM')) {
      let appointments = this.storageSvc.ReturnAppointmentsCurrentMonth();
      console.log('appointments', appointments);
      if (appointments !== null) {
        console.log('appointments');
        this.appointMentsofMonth.set(appointments as IAppoinment[]);
        
        return;
        
    } else {
      await this.callAppointmentfromRest(datetoSearch, true);
    }
      } else {
        await this.callAppointmentfromRest(datetoSearch);
      }
  }

  private async callAppointmentfromRest(datetoSearch: string , firstCall: boolean = false){
  await this.restAdminSvc.getMonthApoinments(datetoSearch).subscribe(respon => {
          console.log('respon', respon);
          this.appointMentsofMonth.set(respon.data) ;
          if (firstCall) {
            this.storageSvc.SaveAppointmentsCurrentMonth(respon.data);
          }
          
        });
  }

  public operateAppointment(idoffApp : string, operation: string){
    const data = [idoffApp, operation];
    this.restAdminSvc.operateAppointment(data).subscribe( resp => {
      console.log('resp', resp);
      if (resp.status === 'success') {
        //Volver a pintar las citas
        this.chgStateViewAppointments( idoffApp,resp.data);
      }
      
    });
  }
  
  public async  chargeAppointments(month: string){
    let date = new Date(month);
    await this.recoveryAppointments(date);
  }


  //#region METHODS TO CHANGE DOM ELEMENTS
  public chgStateViewAppointments(idoffApp: string, state: string){
      this.appointMentsofMonth.update( array => {     
          return array.map( appointment=> {
            if (appointment.id === idoffApp) {
              appointment.status = state;
            } 
            return appointment; // Return the updated appointment
          });
        });
      this.selectedDay.set(new Date (this.selectedDay()));
  }
  public paintAppointments(appointments : IAppoinment[] ) {
    appointments.forEach(appointment => {
      this.paintAppointment(appointment);
    
    })
  }

  public paintAppointment(appointment: IAppoinment){
  console.log('Entranndo a pintar cita');
      let numberday = format(appointment.date, 'd');
      let daysContainer = document.getElementById(`day-appts-${numberday}`);
      let dayContainer = document.createElement('div');
      dayContainer?.classList.add( this.colorAppointment(appointment.status,true), 'text-white', 'rounded', 'p-1', 'mb-1');
      let info = document.createElement('span');
      info.textContent = `${format(appointment.date, "HH")}:${format(appointment.date, "mm")} - ${appointment.patient?.name.toCapitalCase()} ${appointment.patient?.lastname.toCapitalCase()}`;
      dayContainer.appendChild(info);
      daysContainer?.appendChild(dayContainer);
      
  }

  private unPaintAppointment(appoitment: IAppoinment){
    let numberday = format(appoitment.date, 'd');
    let daysContainer = document.getElementById(`day-appts-${numberday}`);
    daysContainer!.innerHTML= '';
  }

  public unPaintAppointments() {
    console.log('Entranndo a des-pintar citas');
    this.appointMentsofMonth().forEach(appointment => {
      this.unPaintAppointment(appointment);
    });
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
  //#endregion
}


