import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-aside-worker',
  standalone: true,
  imports: [RouterLink, RouterLinkActive ],
  templateUrl: './aside-worker.component.html',
  styleUrl: './aside-worker.component.css'
})
export class AsideWorkerComponent {

}
