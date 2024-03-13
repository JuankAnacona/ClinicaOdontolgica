import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal , toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  providers: [HttpClient, HttpClientModule],
  imports: [
    CommonModule
  ],
})
export class SharedModule { }
