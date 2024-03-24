import { HttpClient , HttpClientModule } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { IRestMessage } from '../models/restmessage';
import { IUser } from '../models/user';
import { Observable } from 'rxjs';
import { IOdon_Service } from '../models/odon_service';
import { IAppoinment } from '../models/appoiment';


@Injectable({
  providedIn: "any"
})
export class RestforAdminService {

  private clientHttp: HttpClient = inject(HttpClient) as HttpClient;
  private url: string = 'http://localhost:3000/api/'
  constructor() { 
  }
  public registerPatient(dataForm: [IUser, string,string]){ 
    return this.clientHttp.post<IRestMessage>(`${this.url}Portals/RegisterUser`, dataForm);
  }

 
  public searchPatients(filter: string):Observable<IRestMessage>{
    return this.clientHttp.post<IRestMessage>(`${this.url}WorkerPortal/SearchPatients`,{filter});
  }
  public getWorkers():Observable<IRestMessage>{
    return this.clientHttp.get<IRestMessage>(`${this.url}WorkerPortal/GetWorkers`);
  }
  public createAppointment(dataform:[IAppoinment,boolean,IUser]): Observable<IRestMessage>{

    return this.clientHttp.post<IRestMessage>(`${this.url}WorkerPortal/CreateAppointment`,dataform);

  }
  public getMonthApoinments(datesosearch: string): Observable<IRestMessage>{
    return this.clientHttp.get<IRestMessage>(`${this.url}WorkerPortal/GetMonthAppointments?datetosearch=${datesosearch}`);
  }
  public operateAppointment(data: string[]): Observable<IRestMessage>{
    return this.clientHttp.post<IRestMessage>(`${this.url}WorkerPortal/OperateAppointment`,{data});
  }

  public getPaginationPatients(): Observable<IRestMessage>{
    return this.clientHttp.get<IRestMessage>(`${this.url}WorkerPortal/GetPaginationPatients`);
  }
  public RecoveryClinicHistory(idpatient: string): Observable<IRestMessage>{
    return this.clientHttp.get<IRestMessage>(`${this.url}WorkerPortal/RecoveryClinicHistory?idpatient=${idpatient}`);
  }
  
}
