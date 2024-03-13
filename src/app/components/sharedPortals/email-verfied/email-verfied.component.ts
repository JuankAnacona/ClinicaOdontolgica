import { Component, Signal } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, tap, concatMap, delay } from 'rxjs';
import { IRestMessage } from '../../../models/restmessage';
import { NodeRestService } from '../../../services/node-rest.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-email-verfied',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './email-verfied.component.html',
  styleUrl: './email-verfied.component.css'
})
export class EmailVerfiedComponent {

  public tittle:string = 'Activando cuenta...';
  public message:string = '';
  public success:boolean = false;
  

  private paramsSuscriptor!: Subscription;
  constructor(private activatedRoute: ActivatedRoute, private router : Router, private restSvc: NodeRestService) { 
  }
  ngOnDestroy() {
    this.paramsSuscriptor.unsubscribe();
  }
 ngOnInit() {
    this.paramsSuscriptor=this.activatedRoute
                              .queryParamMap
                              .pipe(
                                    tap( (parametros:ParamMap)=>console.log('parametros en url....', parametros.keys)   ),
                                    concatMap( (parametros:ParamMap)=>{
                                                              let _mode: string|null=parametros.get('mode');
                                                              let _oobcode: string|null=parametros.get('oobCode');
                                                              let _apiKey: string|null=parametros.get('apiKey');
                                                              return this.restSvc.activateAccount(_mode,_oobcode,_apiKey);
                                      
                                    } )
                              ).subscribe( (resp:IRestMessage)=>{
                                              if(resp.code==0){
                                                this.success=true;
                                                this.tittle=resp.message.split(':')[0];
                                                this.message=resp.message.split(':')[1];
                                                

                                            } else {
                                                this.tittle='Error Activando Cuenta';
                                                this.message=resp.error_description!;
                                              //mostrar mensajes de error en vista (fallo activacion)
                                            } 
                              });
}
}
