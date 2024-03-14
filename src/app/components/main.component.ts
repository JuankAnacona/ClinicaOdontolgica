import { Component } from '@angular/core';
import { RouterModule} from '@angular/router';
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

