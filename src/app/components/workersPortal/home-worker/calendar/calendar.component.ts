import { Component, EventEmitter, Output, WritableSignal, signal } from '@angular/core';
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


  @Output() updateSelectedDay:EventEmitter<Date>=new EventEmitter<Date>();

public today = startOfToday();
public selectedDay : WritableSignal<Date> = signal(this.today);
public format2 = format;
public currentMonth : WritableSignal<string> = signal(format(this.today, 'MMM-yyyy'));
public firstDayCurrentMonth : WritableSignal<Date> = signal(parse(this.currentMonth(), 'MMM-yyyy', new Date()));
public arrayNum = [];
public daysofweek = [{ name: 'Domingo', short: 'Dom' },
{ name: 'Lunes', short: 'Lun' },
{ name: 'Martes', short: 'Mar' },
{ name: 'Miércoles', short: 'Mié' },
{ name: 'Jueves', short: 'Jue' },
{ name: 'Viernes', short: 'Vie' },
{ name: 'Sábado', short: 'Sáb' }
];
  public days : WritableSignal<Date[]> = signal(eachDayOfInterval({
    start: this.firstDayCurrentMonth(),
    end: endOfMonth(this.firstDayCurrentMonth()),
  }));

  changeFirstDayCurrentMonth() {
    this.firstDayCurrentMonth.set(parse(this.currentMonth(), 'MMM-yyyy', new Date()));
  }
 
  changeDays(){
    this.days.set(eachDayOfInterval({
      start: this.firstDayCurrentMonth(),
      end: endOfMonth(this.firstDayCurrentMonth()),
    }));
  };
    classNames(...classes: any[]) {
      return classes.filter(Boolean).join(' ');
    }
    createRange(number : string | number): Array<number>{
  // return new Array(number);
  number = Number(number);
  console.log('number', number);
  return new Array(number).fill(0)
    .map((n, index) => index + 1);
}

    previousMonth() {
      console.log('previousMonth');
      this.changeFirstDayCurrentMonth();
      let firstDayNextMonth = add(this.firstDayCurrentMonth(), { months: -1 });
      this.currentMonth.set(format(firstDayNextMonth, 'MMM-yyyy'));
      this.changeDays();
    }

    nextMonth() {
      console.log('nextMonth');
      this.changeFirstDayCurrentMonth();
      let firstDayNextMonth = add(this.firstDayCurrentMonth(), { months: 1 });
      this.currentMonth.set(format(firstDayNextMonth, 'MMM-yyyy'));
      this.changeDays();
    }

    chgSelectedDay(day: Date) {
      this.updateSelectedDay.emit(day);
    }

}
