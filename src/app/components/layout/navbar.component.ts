
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NodeRestService } from '../../services/node-rest.service';
import { IOdon_Service } from '../../models/odon_service';
import { Component , Inject, signal, Signal, inject } from '@angular/core';
import { toSignal  } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 public odon_services : Signal<IOdon_Service[]>= signal<IOdon_Service[]>([]);
  
@Inject (NodeRestService) private restSvc: NodeRestService = inject(NodeRestService);
  constructor( ){
   this.odon_services =  toSignal(this.restSvc.getOdonServices() as Observable<IOdon_Service[]>, {initialValue: []}); }
}
