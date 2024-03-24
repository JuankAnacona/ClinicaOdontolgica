import { Component,Inject,Input,OnInit, WritableSignal, inject, signal } from '@angular/core';
import { PaginationComponent } from './pagination/pagination.component';
import { FilterOptionsComponent } from './filter-options/filter-options.component';
import { IUser } from '../../../../../models/user';
import { RestforAdminService } from '../../../../../services/rest-for-admin';
import { TablePatientsComponent } from './table-patients/table-patients.component';
import { AsideWorkerComponent } from '../../../aside-worker/aside-worker.component';
@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [PaginationComponent, FilterOptionsComponent, TablePatientsComponent, AsideWorkerComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {

  @Inject (RestforAdminService) private restAdminSvc: RestforAdminService = inject(RestforAdminService);
  

  public currentPatients: WritableSignal<IUser[]> = signal([]);


  async ngOnInit(){
    this.restAdminSvc.getPaginationPatients().subscribe(respon => {
      this.currentPatients.set(respon.data);
    });
    console.log(this.currentPatients());
  }


}
