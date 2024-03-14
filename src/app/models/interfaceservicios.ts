import { Observable} from "rxjs";
import { IUser } from "./user";

export interface IStorageService { 
  SaveUserData(datoscliente: IUser): void;
  SaveJWTData(jwt: string): void;
  ReturnUserData(): Observable<IUser>;
  ReturnJWTData(): Observable<string>;
}