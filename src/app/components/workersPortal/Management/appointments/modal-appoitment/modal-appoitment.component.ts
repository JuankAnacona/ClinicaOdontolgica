import { Component, Inject, Input, WritableSignal, OnInit, signal, inject, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { RestforAdminService } from '../../../../../services/rest-for-admin';
import { IUser } from '../../../../../models/user';
import { IAppoinment } from '../../../../../models/appoiment';
import { TranslateDatePipe } from '../../../../../pipes/translate-date.pipe';
import { SearchPatientsDirective } from '../../../../../directives/searchpatients';


@Component({
  selector: 'app-modal-appoitment',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateDatePipe, SearchPatientsDirective],
  templateUrl: './modal-appoitment.component.html',
  styleUrl: './modal-appoitment.component.css'
})
export class ModalAppoitmentComponent {

  @Input() selectedDay!: WritableSignal<Date> ;
  @Input() appointMentsofMonth!: WritableSignal<IAppoinment[]>;
  @Inject (RestforAdminService) private restAdminSvc: RestforAdminService = inject(RestforAdminService);

  public formAppointment: FormGroup = new FormGroup({});
  public newPatient = true;
  public patientsSearchs : WritableSignal<IUser[]> = signal([]);
  public AllWorkers : IUser[] = [];

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
    await this.restAdminSvc.getWorkers().subscribe(respon => {
    this.AllWorkers = respon.data;
  });
  }

  public hours = this.generateHours();

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
    patient = this.instanceNewPatient()!;
    if (!patient) {
      return;
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
    creationDate: new Date(Date.now()),
    ccworker: this.formAppointment.value.worker,
    ccpatient: patient.account!.cc!,
    description: this.formAppointment.value.description,
    status: 'Pendiente'
  };

  console.log('appointment', appointment);
  this.restAdminSvc.createAppointment([appointment,this.newPatient, patient]).subscribe(respon => {
    console.log('respon', respon);
    if (respon.status === 'success') {
      // Meter la nueva cita en el array de citas del mes
      const worker = this.AllWorkers.find((worker) => worker.account?.cc === appointment.ccworker);
      appointment.patient = patient;
      appointment.worker = worker;
      this.appointMentsofMonth.update( array => [...array, appointment]);
      this.formAppointment.reset();
      this.selectedDay.set(new Date (this.selectedDay()));
      document.getElementById('close-modal-new-appointment')?.click();
    }
  });
  }

  instanceNewPatient() : IUser | null {
    let patient : IUser;
    
  if (!this.formAppointment.value.patient.split(',')[1]) {
      alert('El campo Paciente debe llevar el apellido despues de una coma');
      return null;
    }
    // Eliminar espacios en blanco
    let lastname_ = this.formAppointment.value.patient.split(',')[1].trim().toUpperCase();
    let name_ = this.formAppointment.value.patient.split(',')[0].trim().toUpperCase();
    return patient = {
      account: {
        cc: this.formAppointment.value.ccnewPatient,
        activeAccount: false
      },
      name: name_,
      lastname: lastname_,
    }
  }
}
