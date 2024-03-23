import { Injectable, Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IUser } from '../models/user';
import { IStorageService } from '../models/interfaceservicios';
import { IAppoinment } from '../models/appoiment';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService implements IStorageService {

  userWritableSingal: WritableSignal<IUser | null> = signal<IUser | null>(null);
  userSignal: Signal<IUser | null> = computed(()=>{
    return this.userWritableSingal();
  });
  

  constructor() { 
    
  }
  
  SaveUserData(_datauser: IUser): void {
   localStorage.setItem('datauser',JSON.stringify(_datauser));
   
  }
  SaveJWTData(jwt: string): void {
    localStorage.setItem('token', jwt);
  }
  ReturnUserData(): Observable<IUser> {
    let _datauser:IUser=(JSON.parse( localStorage.getItem('datauser')! )) as IUser;
    return of( _datauser );
  }
  ReturnJWTData(): Observable<string> {
    let _jwt=localStorage.getItem('token')!;
    return of(_jwt);
  }
  SaveAppointmentsCurrentMonth(_appointments: IAppoinment[]): void {
    localStorage.setItem('appointments',JSON.stringify(_appointments));
  }
  ReturnAppointmentsCurrentMonth(): IAppoinment[] | null {
    let item = localStorage.getItem('appointments');
    console.log('item', item);
    if (item==null) {
      return null;
    }
    let _appointments:IAppoinment[]=(JSON.parse( item ));
    
    return _appointments ;
  }
  removeUserData(): void {
    localStorage.removeItem('datauser');
    localStorage.removeItem('token');
  }


}