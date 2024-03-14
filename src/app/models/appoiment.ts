import { IUser } from "./user";

export interface IAppoinment {
 id?: string ;
 date: Date;
 worker: IUser;
 patient: IUser;
 description: string;
 status: string;




}