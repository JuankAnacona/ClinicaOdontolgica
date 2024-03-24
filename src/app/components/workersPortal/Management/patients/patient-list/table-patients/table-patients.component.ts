import { Component, Input, WritableSignal } from '@angular/core';
import { IUser } from '../../../../../../models/user';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-table-patients',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './table-patients.component.html',
  styleUrl: './table-patients.component.css'
})
export class TablePatientsComponent {

  @Input() patients!: WritableSignal<IUser[]>;
}
