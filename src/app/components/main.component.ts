import { Component , Inject, OnInit, signal, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Router, RouterLink,  RouterLinkActive, RouterOutlet, RouterModule} from '@angular/router';
import { IOdon_Service } from '../models/odon_service';
import { NodeRestService } from '../services/node-rest.service';
import { HttpClientModule } from '@angular/common/http';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './layout/navbar.component';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, HttpClientModule, NavbarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
 public title:string  = 'Centro de Sonrisas';
 

  ngOnInit(): void {
    initFlowbite();
  }
}

