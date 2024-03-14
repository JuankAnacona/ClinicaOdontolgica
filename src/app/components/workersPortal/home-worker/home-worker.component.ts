import { Component, Inject, Signal, WritableSignal, inject, signal } from '@angular/core';
import { AsideWorkerComponent } from '../aside-worker/aside-worker.component';
import { CommonModule } from '@angular/common';



import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns'
import { Observable, of } from 'rxjs';
import { IUser } from '../../../models/user';
import { RestforAdminService } from '../../../services/rest-for-admin';
import { SearchPatientsDirective } from '../../../directives/searchpatients';
import { CalendarComponent } from './calendar/calendar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAppoinment } from '../../../models/appoiment';
@Component({
  selector: 'app-home-worker',
  standalone: true,
  imports: [CommonModule, AsideWorkerComponent, SearchPatientsDirective, CalendarComponent,ReactiveFormsModule],
  templateUrl: './home-worker.component.html',
  styleUrl: './home-worker.component.css'
})
export class HomeWorkerComponent {

@Inject (RestforAdminService) private restAdminSvc: RestforAdminService = inject(RestforAdminService);


public patientsSearchs : WritableSignal<IUser[]> = signal([]);
public AllWorkers : IUser[] = [];

public today = startOfToday();
public selectedDay : WritableSignal<Date> = signal(this.today);

public hours = this.generateHours();

public formAppointment: FormGroup = new FormGroup({});

public newPatient = true;

constructor(){
  this.restAdminSvc.getWorkers().subscribe(respon => {
    this.AllWorkers = respon.data;
  });
  this.formAppointment = new FormGroup({
    date: new FormControl('', Validators.required),
    hour: new FormControl('', Validators.required),
    worker: new FormControl('', Validators.required),
    patient: new FormControl('', Validators.required),
    ccnewPatient: new FormControl('', Validators.required),
    description: new FormControl('', ),
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
  console.log('selectedDay', this.selectedDay());
  //this.selectedDayMeetings = this.getMeetingsOfDay(day);
 }

 selectPatient(patient: string) {
  console.log('cc', patient);
  this.formAppointment.controls['patient'].setValue(patient);
  this.newPatient = false;
  
 }
 saveAppointment() {
  
  //Si el paciente no existe se debe registrar uno nuevo
  let patient : IUser ;
  if (this.newPatient) {
    console.log('paciente nuevo');
    patient = {
      account: {
        cc: this.formAppointment.value.ccnewPatient
      },
      name: this.formAppointment.value.patient.split(',')[0],
      lastname: this.formAppointment.value.patient.split(',')[1],
    }
  } else {
    patient = this.patientsSearchs().find((patient) => patient.account?.cc! === this.formAppointment.value.patient.split('-')[1])!;
  }

  const worker = this.AllWorkers.find((worker) => worker.account?.cc === this.formAppointment.value.worker);

  
  let dateWithHour : Date = new Date(this.selectedDay());
  let hora = this.formAppointment.value.hour.split(':');
  dateWithHour.setHours(Number(hora[0]), Number(hora[1]));

  console.log('dateWithHour', dateWithHour);
  let appointment : IAppoinment = {
    date: dateWithHour,
    worker: worker!,
    patient: patient,
    description: this.formAppointment.value.description,
    status: 'Pendiente'
  };
  console.log('appointment', appointment);
  }

 }
 
  /*public selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  )*/



