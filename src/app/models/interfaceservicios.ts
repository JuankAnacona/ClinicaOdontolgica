import { Observable} from "rxjs";
import { IUser } from "./user";
import { IAppoinment } from "./appoiment";

export interface IStorageService { 
  SaveUserData(datoscliente: IUser): void;
  SaveJWTData(jwt: string): void;
  ReturnUserData(): Observable<IUser>;
  ReturnJWTData(): Observable<string>;
  SaveAppointmentsCurrentMonth(_appointments: IAppoinment[]): void;
  ReturnAppointmentsCurrentMonth(): IAppoinment[] | null;
  removeUserData(): void; 
}