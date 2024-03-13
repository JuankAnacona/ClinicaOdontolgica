import { Component, EnvironmentInjector, Inject, Signal, inject, runInInjectionContext, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule , FormControl, Validators} from '@angular/forms';
import { NodeRestService } from '../../../services/node-rest.service';
import { IRestMessage } from '../../../models/restmessage';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-login-workers',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-workers.component.html',
  styleUrl: './login-workers.component.css'
})
export class LoginWorkersComponent {

 @Inject (NodeRestService) private restSvc: NodeRestService = inject(NodeRestService);
  injector = inject(EnvironmentInjector);
  private resp : Signal<IRestMessage|null> = signal(null);
  private res2! : IRestMessage;
  public FormLogin = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

    async doWorkerLogin(){
    if (this.FormLogin.valid){
      await this.restSvc.login('worker', this.FormLogin.value).subscribe(
        (data: IRestMessage) => {
          this.res2 = data;
           if (this.res2.code == 0){
      console.log('Login success');
    } else{
      console.log('Login failed');
      
    
    }
          console.log(this.res2);
        }
      )
      
       /*runInInjectionContext(this.injector,  () => {
      this.resp = toSignal(this.restSvc.login('worker', this.FormLogin.value) as Observable<IRestMessage>, {initialValue: null});
        console.log(this.resp());*/
    };
   
   }

}
