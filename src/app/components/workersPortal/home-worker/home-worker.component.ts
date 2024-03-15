import { Component, Inject, WritableSignal, inject, signal } from '@angular/core';
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

public appointMentsofMonth : IAppoinment[] = [];
public appointMentsofDay : WritableSignal<IAppoinment[]> = signal([]);

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

 updateSelectedDay(day: Date) {
  this.selectedDay.set(day);
  this.chgApointmentsOfDay();
  console.log('selectedDay', this.selectedDay());

  //this.selectedDayMeetings = this.getMeetingsOfDay(day);
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

  console.log('dateWithHour', dateWithHour);
  let appointment : IAppoinment = {
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
      this.appointMentsofMonth.push(appointment);
      this.paintAppointments();

    }

  });
  }

  async  recoveryAppointments()  {
    let datetoSearch = format(this.selectedDay(), 'yyyy-MM');
    await this.restAdminSvc.getMonthApoinments(datetoSearch).subscribe(respon => {
      console.log('respon', respon);
      this.appointMentsofMonth = respon.data;
      this.paintAppointments();
    });
    

  }

  private paintAppointments() {
    this.appointMentsofMonth.forEach(appointment => {
      console.log('Entranndo a pintar cita');
      let numberday = format(appointment.date, 'd');
      let daysContainer = document.getElementById(`day-appts-${numberday}`);
      let dayContainer = document.createElement('div');
      dayContainer?.classList.add( 'bg-purple-400', 'text-white', 'rounded', 'p-1', 'mb-1');
      let info = document.createElement('span');
      info.textContent = `${format(appointment.date, "HH")}:${format(appointment.date, "mm")} - ${appointment.ccpatient}`;
      dayContainer.appendChild(info);
      daysContainer?.appendChild(dayContainer);
    
    })
  }

  private chgApointmentsOfDay() {
   let day = format(this.selectedDay(), 'dd');
   this.appointMentsofDay.set(
   this.appointMentsofMonth.filter((appointment) => {
      return format(appointment.date, 'dd') === day;    
   }));
 }

  public cancelAppointment(idAppointment : any){}
  public editAppointment(idAppointment : any){}
 }
 
 
  /*public selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  )*/



