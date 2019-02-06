import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { InicioLoginPage } from '../inicio-login/inicio-login';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-recuperar',
  templateUrl: 'recuperar.html',
})
export class RecuperarPage {
  public recuperarForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder
    ) {
      this.recuperarForm = this.formBuilder.group({
        correo: ['', Validators.compose([Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
          ])]
      });
  }

  enviarMail(){
    console.log("correo",this.recuperarForm.value.correo);

    if (this.recuperarForm.get('correo').hasError('required')) {
    // if (this.recuperarForm.value.correo == "") {
      this.doAlert("Error!!!","Campo requerido")
    } else {
      if (this.recuperarForm.get('correo').errors &&
        this.recuperarForm.get('correo').dirty &&
        this.recuperarForm.get('correo').hasError('pattern')) {
         console.log("No entra");
         this.doAlert("Error!!!","Escribe el correo correctamente")
      } else {
        console.log("Entroooo");
        // requerirPass
        this.ds.requerirPass(this.recuperarForm.value.correo)
        .subscribe(res2 =>{
          console.log("res2", res2);
          this.doAlertConfirm("Info","Se ha enviado el correo, Sigue los pasos para reestablecer tu contraseña")
        })
      }
    }
  }
  doAlert(titulo, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });

    alert.present();
  }

  doAlertConfirm(titulo, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: [
        {
        text: 'Ok',
        handler: () => {
          console.log('Ok clicked');
          this.navCtrl.setRoot(InicioLoginPage);
        }
      }]
    });

    alert.present();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RecuperarPage');
  }

}
