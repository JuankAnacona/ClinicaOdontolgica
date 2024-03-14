import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IUser } from '../models/user';
import { IStorageService } from '../models/interfaceservicios';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService implements IStorageService {

  constructor() { }
  
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


}