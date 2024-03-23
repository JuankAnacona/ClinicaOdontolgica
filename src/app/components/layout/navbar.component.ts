
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NodeRestService } from '../../services/node-rest.service';
import { IOdon_Service } from '../../models/odon_service';
import { Component , Inject, signal, Signal, inject } from '@angular/core';
import { toSignal  } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { MY_TOKEN_SERVICESTORAGE } from '../../services/injectiontokenstorageservices';
import { LocalstorageService } from '../../services/localstorage.service';
import { IUser } from '../../models/user';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Inject (NodeRestService) private restSvc: NodeRestService = inject(NodeRestService);
  @Inject (MY_TOKEN_SERVICESTORAGE) private storageSvc = inject(LocalstorageService);
  public odon_services : Signal<IOdon_Service[]>= signal<IOdon_Service[]>([]);
  public userwelcome!: Signal<IUser | null> ;
  
  constructor( ){
   this.odon_services =  toSignal(this.restSvc.getOdonServices() as Observable<IOdon_Service[]>, {initialValue: []}); 
   this.userwelcome = toSignal(this.storageSvc.ReturnUserData(), {initialValue: null});
  }
  logout(){
    this.storageSvc.removeUserData();
  }
  
  
}
