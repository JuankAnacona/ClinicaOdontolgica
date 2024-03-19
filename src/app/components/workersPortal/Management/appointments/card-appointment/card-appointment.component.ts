import { Component, Input, Output , EventEmitter} from '@angular/core';
import { IAppoinment } from '../../../../../models/appoiment';
import { format } from 'date-fns';

@Component({
  selector: 'app-card-appointment',
  standalone: true,
  imports: [],
  templateUrl: './card-appointment.component.html',
  styleUrl: './card-appointment.component.css'
})
export class CardAppointmentComponent {
@Input() appointment!: IAppoinment;
@Input() colorAppointment!: Function;
@Output() launchOperateApp : EventEmitter<string[]> = new EventEmitter<string[]>();
public format = format;

launchEvent(id: string, status: string){
  this.launchOperateApp.emit([id, status]);

}
triggerModalAppointment(id: string){
  document.getElementById('crud-modal-toggle')?.click();
  
}
}
