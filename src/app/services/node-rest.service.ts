import { HttpClient , HttpClientModule } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { IRestMessage } from '../models/restmessage';
import { IUser } from '../models/user';
import { Observable } from 'rxjs';
import { IOdon_Service } from '../models/odon_service';


@Injectable({
  providedIn: "any"
})
export class NodeRestService {

  private clientHttp: HttpClient = inject(HttpClient) as HttpClient;
  private url: string = 'http://localhost:3000/api/'
  constructor() { 
  }
  public registerPatient(dataForm: [IUser, string,string]){ 
    return this.clientHttp.post<IRestMessage>(`${this.url}Portals/RegisterUser`, dataForm);
  }

  public getOdonServices(): Observable<IOdon_Service[]>{
    return this.clientHttp.get<IOdon_Service[]>(`${this.url}Clinic/GetOdonServices`);
  }
  public activateAccount(mode:string|null, oobCode:string|null, apiKey:string|null):Observable<IRestMessage>{
      return this.clientHttp.get(`http://localhost:3000/api/Portals/activateAccount?mod=${mode}&cod=${oobCode}&key=${apiKey}`) as Observable<IRestMessage>;
  }
  public login(typeLogin:string,data:object):Observable<IRestMessage>{
    let endpoint ='';
    typeLogin=='worker' ? endpoint='WorkerPortal/' : endpoint='PatientPortal/';
    return this.clientHttp.post<IRestMessage>(`${this.url}${endpoint}Login`,data);
  }
}
