import { Component, Inject, Signal, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { AsideWorkerComponent } from '../aside-worker/aside-worker.component';
import { CommonModule } from '@angular/common';

import {format, startOfToday,getHours } from 'date-fns'
import { IUser } from '../../../models/user';
import { RestforAdminService } from '../../../services/rest-for-admin';
import { SearchPatientsDirective } from '../../../directives/searchpatients';
import { CalendarComponent } from './calendar/calendar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAppoinment } from '../../../models/appoiment';

@Component({
  selector: 'app-home-worker',
  standalone: true,
  imports: [CommonModule, AsideWorkerComponent, 
    SearchPatientsDirective, CalendarComponent,ReactiveFormsModule,],
  templateUrl: './home-worker.component.html',
  styleUrl: './home-worker.component.css'
})
export class HomeWorkerComponent {

@Inject (RestforAdminService) private restAdminSvc: RestforAdminService = inject(RestforAdminService);


public patientsSearchs : WritableSignal<IUser[]> = signal([]);
public AllWorkers : IUser[] = [];

public appointMentsofMonth : WritableSignal<IAppoinment[]> = signal([]);
public appointMentsofDay : Signal<IAppoinment[]> = computed(()=>{
  let day = format(this.selectedDay(), 'dd');
   
   return this.appointMentsofMonth().filter((appointment) => {
      return format(appointment.date, 'dd') === day;    
   });});

public today = startOfToday();
public selectedDay : WritableSignal<Date> = signal(this.today);

public hours = this.generateHours();

public formAppointment: FormGroup = new FormGroup({});

public newPatient = true;

public getHours = getHours;
public format = format;

constructor(){
  
  this.formAppointment = new FormGroup({
    hour: new FormControl('', Validators.required),
    worker: new FormControl('', Validators.required),
    patient: new FormControl('', Validators.required),
    ccnewPatient: new FormControl('', ),
    description: new FormControl('', ),
  });

}



async ngOnInit() {
  await this.recoveryAppointments();
  await this.restAdminSvc.getWorkers().subscribe(respon => {
    this.AllWorkers = respon.data;
  });
}
    
 private generateHours(): string[] {
  const hours: string[] = [];
  for (let i = 8; i <= 19; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hour = `${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`;
      hours.push(hour);
    }
  }
  return hours;
}

onSearch(filter: any) {
  console.log('filter', filter);
    if(filter.length <=0){
      this.patientsSearchs.set([]);
      return;
    }
    
    this.restAdminSvc.searchPatients(filter).subscribe(respon => {
      console.log('respon', respon);
      this.patientsSearchs.set(respon.data);
    });
 }

 

 selectPatient(patient: string) {
  console.log('cc', patient);
  this.formAppointment.controls['patient'].setValue(patient);
  this.newPatient = false;
 }
 saveAppointment() {
  // TODO: Verify of arleady exist an appoinmint in the same date and hour

  //Si el paciente no existe se debe registrar uno nuevo
  let patient : IUser ;
  if (this.newPatient) {
    console.log('paciente nuevo');
    
    if (!this.formAppointment.value.patient.split(',')[1]) {
      alert('El campo Paciente debe llevar el apellido despues de una coma');
      return;
    }
    // Eliminar espacios en blanco
    let lastname_ = this.formAppointment.value.patient.split(',')[1].trim();
    let name_ = this.formAppointment.value.patient.split(',')[0].trim();
    patient = {
      account: {
        cc: this.formAppointment.value.ccnewPatient
      },
      name: name_,
      lastname: lastname_,
    }
  } else {
    patient = this.patientsSearchs().find((patient) => patient.account?.cc! === this.formAppointment.value.patient.split('-')[1])!;
  }

  let dateWithHour : Date = new Date(this.selectedDay());
  let hora = this.formAppointment.value.hour.split(':');
  dateWithHour.setHours(Number(hora[0]), Number(hora[1]));

  let appointment : IAppoinment = {
    id: crypto.randomUUID(),
    date: dateWithHour,
    ccworker: this.formAppointment.value.worker,
    ccpatient: patient.account!.cc!,
    description: this.formAppointment.value.description,
    status: 'Pendiente'
  };
  console.log('appointment', appointment);
  this.restAdminSvc.createAppointment([appointment,this.newPatient, patient]).subscribe(respon => {
    console.log('respon', respon);
    if (respon.status === 'success') {
      document.getElementById('close-modal-new-appointment')?.click();
      // Meter la nueva cita en el array de citas del mes
      const worker = this.AllWorkers.find((worker) => worker.account?.cc === appointment.ccworker);
      appointment.patient = patient;
      appointment.worker = worker;
      this.appointMentsofMonth.update( array => [...array, appointment]);
      this.paintAppointment(appointment);
      this.formAppointment.reset();
      this.selectedDay.set(this.selectedDay());
    }
    

  });
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
      case 'Realizada-Asistio':
      case 'Realizada-No Asistio':
        return forCalendar ? 'bg-green-500':'bg-green-200';
      default:
        return forCalendar ? 'bg-yellow-500' :'bg-white hover:bg-gray-100';
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
 
 
 



