import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { Component } from '@angular/core';
import { InicioLoginPage } from '../inicio-login/inicio-login';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  public registroForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder
    ) {
      //constructor
      this.registroForm = this.formBuilder.group({
        correo: ['', Validators.compose([Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
          ])],
        password: ['', Validators.compose([Validators.required
          ,Validators.minLength(4)
        ])],
        passwordC: ['', Validators.compose([Validators.required
          ,Validators.minLength(4)
        ])],
      });
  }
  enviarRegistro(){
    console.log("correo", this.registroForm.value.correo);
    console.log("pass", this.registroForm.value.password);
    console.log("passdC", this.registroForm.value.passwordC);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

}
