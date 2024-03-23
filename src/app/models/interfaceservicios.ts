import { Observable} from "rxjs";
import { IUser } from "./user";
import { IAppoinment } from "./appoiment";
import { Signal } from "@angular/core";

export interface IStorageService { 
  SaveUserData(datoscliente: IUser): void;
  SaveJWTData(jwt: string): void;
  ReturnUserData(): Signal<IUser>
  ReturnJWTData(): Observable<string>;
  SaveAppointmentsCurrentMonth(_appointments: IAppoinment[]): void;
  ReturnAppointmentsCurrentMonth(): IAppoinment[] | null;
  removeUserData(): void; 
}