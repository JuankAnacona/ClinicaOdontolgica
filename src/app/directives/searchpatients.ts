import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { fromEvent, map, debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Directive({
  selector: '[appSearchPatients]',
  standalone: true
})
export class SearchPatientsDirective {
  @Output() appSearch = new EventEmitter<string>();

  constructor(private el: ElementRef) { }

  ngOnInit() {
    fromEvent(this.el.nativeElement, 'input').pipe(

      map((e: any) => e.target.value ),
      
      debounceTime(400),
      distinctUntilChanged(),
      tap(e =>
      console.log('en directiva, valor de e:' + e)),
    ).subscribe(
      (text: unknown) => 
      this.appSearch.emit(text as string));
  }
}
