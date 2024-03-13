import { Component, EnvironmentInjector, Inject, Signal, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NodeRestService } from '../../../services/node-rest.service';
import { IRestMessage } from '../../../models/restmessage';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

 @Inject (NodeRestService) private restSvc: NodeRestService = inject(NodeRestService);
  injector = inject(EnvironmentInjector);
  private resp : Signal<IRestMessage|null> = signal(null);
  private res2! : IRestMessage;
  public FormLogin = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

    async doPatientLogin(){
    if (this.FormLogin.valid){
      await this.restSvc.login('patient', this.FormLogin.value).subscribe(
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
