import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { InicioLoginPage } from '../inicio-login/inicio-login';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Keyboard } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-recuperar',
  templateUrl: 'recuperar.html',
})
export class RecuperarPage {
  public recuperarForm: FormGroup;
  public imgUrl;
  public tokenR;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider,
    public alertCtrl: AlertController,
    public keyboard : Keyboard,
    public formBuilder: FormBuilder
    ) {
      this.recuperarForm = this.formBuilder.group({
        correo: ['', Validators.compose([Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])],
        captcha: ['', Validators.compose([Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6)
        ])]
      });
  }

  enviarMail(){
    console.log("correo",this.recuperarForm.value.correo);

    if (this.recuperarForm.get('correo').hasError('required') ||
      this.recuperarForm.get('captcha').hasError('required')) {

      this.doAlert("Error!!!","Campo requerido")
    } else {
      if (this.recuperarForm.get('correo').errors &&
        this.recuperarForm.get('correo').dirty &&
        this.recuperarForm.get('correo').hasError('pattern')) {
         console.log("No entra");
         this.doAlert("Error!!!","Escribe el correo correctamente")
      }
      else if (this.recuperarForm.get('captcha').hasError('minlength')){
        this.doAlert("Error!!!", "Captcha: "+this.validation_messages.captcha[1]["message"])
      }
      else if (this.recuperarForm.get('captcha').hasError('maxlength')){
        this.doAlert("Error!!!", "Captcha: "+this.validation_messages.captcha[2]["message"])
      }
      else {
        console.log("Entroooo");
        let infoCaptcha = {
          token: this.tokenR,
          word: this.recuperarForm.value.captcha
        }
        // requerirPass
        this.ds.requerirPass(this.recuperarForm.value.correo, infoCaptcha)
        .subscribe(res2 =>{
          console.log("res2", res2);
          this.doAlertConfirm("Info","Se ha enviado el correo, Sigue los pasos para reestablecer tu contraseña")
        }, error => {
          console.log("error al registrar", error);
          this.doAlert("Error!!!","Captcha incorrecto")
        })
      }
    }
  }

  obtnerCaptchaTs(){
    this.ds.obtenerCaptcha()
    .subscribe(res =>{
      this.imgUrl = res["result"]["captcha"];
      this.tokenR = res["result"]["token"];
    }, error => {
      console.log("error obtener Captcha",error);
    })
  }

  validation_messages = {
    'captcha': [
      { type: 'required', message: 'Campo Requerido' },
      { type: 'minlength', message: 'M\u00EDnimo 6 caracteres' },
      { type: 'maxlength', message: 'M\u00E1ximo 6 caracteres' }
    ]
  };

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
          //console.log('Ok clicked');
          this.navCtrl.setRoot(InicioLoginPage);
        }
      }]
    });

    alert.present();
  }
  ionViewWillEnter(){
    this.obtnerCaptchaTs();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RecuperarPage');
  }

}
