import { Component, EventEmitter, Input, Output, Signal, WritableSignal, computed, signal } from '@angular/core';
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
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  @Input() selectedDay!: WritableSignal<Date> ;

public today = startOfToday();
public currentMonth : WritableSignal<string> = signal(format(this.today, 'MMM-yyyy'));
public format = format;

public firstDayCurrentMonth : Signal<Date> = computed(()=>{ return (parse(this.currentMonth(), 'MMM-yyyy', new Date()))}) ;
public days : Signal<Date[]> = computed(()=>{return (eachDayOfInterval({
  start: this.firstDayCurrentMonth(),
  end: endOfMonth(this.firstDayCurrentMonth()),
}))});

public daysofweek = [{ name: 'Domingo', short: 'Dom' },
{ name: 'Lunes', short: 'Lun' },
{ name: 'Martes', short: 'Mar' },
{ name: 'Miércoles', short: 'Mié' },
{ name: 'Jueves', short: 'Jue' },
{ name: 'Viernes', short: 'Vie' },
{ name: 'Sábado', short: 'Sáb' }
];


  changeFirstDayCurrentMonth(addMonth: boolean = true) {
    let number = addMonth ? 1 : -1;
    let firstDayNextMonth = add(this.firstDayCurrentMonth(), { months: number });
      this.currentMonth.set(format(firstDayNextMonth, 'MMM-yyyy'));
  }
 
    createRange(number : string | number): Array<number>{
  number = Number(number);
  console.log('number', number);
  return new Array(number).fill(0)
    .map((index) => index + 1);
}

    chgMonth(addMonth: boolean = true) {
      this.changeFirstDayCurrentMonth(addMonth);
    }

    chgSelectedDay(day: Date) {
      this.selectedDay.set(day);
    }

}
