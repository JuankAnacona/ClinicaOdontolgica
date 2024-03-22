import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NodeRestService } from '../../../services/node-rest.service';
import { map } from 'rxjs';
import { IRestMessage } from '../../../models/restmessage';
import { Router } from '@angular/router';
import { IUser } from '../../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  public registroForm: FormGroup;
  private patient!: IUser;
  public typeUser = 'patient';
  public classBtnPatient = ' text-white bg-blue-500';
  public classBtnWorker = ' text-blue-500 border border-blue-500 bg-white';
  constructor(private restNodeSvc: NodeRestService, private router: Router) {

    this.registroForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      cc: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')]),
      repassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')]),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      phone: new FormControl(),
    });
  }

  finishRegistration() {
    try {

      console.log(this.registroForm);
      this.patient = {
        name: (this.registroForm.value.name).toLowerCase(),
        lastname: this.registroForm.value.lastname.toLowerCase(),
        account: { email: this.registroForm.value.email , cc:this.registroForm.value.cc , activeAccount: false},
        phone: this.registroForm.value.phone,
        accountcreation: new Date( Date.now())
      }
      this.restNodeSvc.registerPatient([this.patient,this.registroForm.value.password, this.typeUser]).subscribe(
        (data: IRestMessage) => {
          if (data.status === 'success') {
            this.router.navigate(['/Portales/RegistroCompletado']);
          } else {
            console.log(data.message);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }

  }

  changeType(type: string) {
    
    type === 'worker' ? (this.classBtnPatient = ' text-blue-500 border border-blue-500 bg-white', this.classBtnWorker = ' text-white bg-blue-500')
                      : (this.classBtnPatient= ' text-white bg-blue-500', this.classBtnWorker = ' text-blue-500 border border-blue-500 bg-white'); 
                      this.typeUser = type;
  }

}
