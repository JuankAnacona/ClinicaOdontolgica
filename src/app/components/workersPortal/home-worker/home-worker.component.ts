import { Component } from '@angular/core';
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

@Component({
  selector: 'app-home-worker',
  standalone: true,
  imports: [CommonModule, AsideWorkerComponent],
  templateUrl: './home-worker.component.html',
  styleUrl: './home-worker.component.css'
})
export class HomeWorkerComponent {

public today = startOfToday();
public selectedDay = this.today;
public format2 = format;
public currentMonth = format(this.today, 'MMM-yyyy');



public daysofweek = [{ name: 'Domingo', short: 'Dom' },
{ name: 'Lunes', short: 'Lun' },
{ name: 'Martes', short: 'Mar' },
{ name: 'Miércoles', short: 'Mié' },
{ name: 'Jueves', short: 'Jue' },
{ name: 'Viernes', short: 'Vie' },
{ name: 'Sábado', short: 'Sáb' }
];

public firstDayCurrentMonth = parse(this.currentMonth, 'MMM-yyyy', new Date());
public days = eachDayOfInterval({
    start: this.firstDayCurrentMonth,
    end: endOfMonth(this.firstDayCurrentMonth),
  });
 

    classNames(...classes: any[]) {
      return classes.filter(Boolean).join(' ');
    }

    previousMonth() {
      console.log('previousMonth');
      let firstDayNextMonth = add(this.firstDayCurrentMonth, { months: -1 });
      this.currentMonth = format(firstDayNextMonth, 'MMM-yyyy');
    }

    nextMonth() {
      console.log('nextMonth');
      let firstDayNextMonth = add(this.firstDayCurrentMonth, { months: 1 });
      this.currentMonth = format(firstDayNextMonth, 'MMM-yyyy');
    }

  /*public selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  )*/


}
