import { IAddress } from './address';
export interface IPatient {
    name:      string;
    lastname:   string;
    account:      {  email: string, cc: string, activeAccount?:boolean, imagenAvatarBASE64?:string  };
    phone?:    string;
    address?: IAddress;
    genere?:     string;
    birthdate?:    Date;
    accountcreation?: Date;
    description?:   string;
}


