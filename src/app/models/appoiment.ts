import { IUser } from "./user";

export interface IAppoinment {
 id: string ;
 date: Date;
 creationDate?: Date;
 worker?: IUser;
 patient?: IUser;
 description?: string;
 status: string;
 ccworker : string;
 ccpatient : string;
}