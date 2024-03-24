import { IAddress } from './address';
export interface IUser {
    name:      string;
    lastname:   string;
    account?:      {  email?: string, cc: string,typedocument?: string, activeAccount?:boolean, typeuser?: string };
    phone?:    string;
    address?: string;
    city?:      string;
    state?:     string;
    genere?:     string;
    age?:       number;
    family_background?: string;
    accountcreation?: Date;
    idsappointments?: string[];
}


