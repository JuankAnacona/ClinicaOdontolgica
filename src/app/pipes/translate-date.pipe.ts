import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'translateDate',
  standalone: true
})

export class TranslateDatePipe implements PipeTransform {

  private daysEnglish =  [
   'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ];
  private daysSpanish = [
    'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'
  ];
  private monthsEnglish = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  private monthsSpanish = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octobre', 'Noviembre', 'Diciembre'
  ];

  transform(value: Date, ...args: unknown[]): string {
    let date = value;
    let day = date.toString().split(' ')[0];
    let month = date.toString().split(' ')[1];
    let dayNumber = date.toString().split(' ')[2];
    let year = date.toString().split(' ')[3];

    let dayTranslated =  this.daysSpanish[this.daysEnglish.indexOf(day)];
    let monthTranslated = this.monthsSpanish[this.monthsEnglish.indexOf(month)];
    return `${dayTranslated} ${dayNumber}, de ${monthTranslated} del ${year}`;

  }

}
