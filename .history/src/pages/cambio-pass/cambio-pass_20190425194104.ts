import { PasswordValidatorProvider } from './../../providers/password-validator/password-validator';
import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Keyboard, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { InicioLoginPage } from '../inicio-login/inicio-login';
import * as CryptoJS from 'crypto-js';

@IonicPage()
@Component({
  selector: 'page-cambio-pass',
  templateUrl: 'cambio-pass.html',
})
export class CambioPassPage {
  public cambioPassForm: FormGroup;
  matching_passwords_group: FormGroup;
  private usuario;
  private token;
  public loader: any;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public ds: DarumaServiceProvider,
  public alertCtrl: AlertController,
  public keyboard: Keyboard,
  public loadingCtrl: LoadingController,
  public formBuilder: FormBuilder
  ) {
    this.token =     navParams.get("token");
    this.matching_passwords_group = new FormGroup({
      passwordN: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.maxLength(20)
      ])),
      passwordNC: new FormControl('', Validators.required)
      }, (formGroup: FormGroup) => {
      return PasswordValidatorProvider.areEqual(formGroup);
    });
    this.cambioPassForm = this.formBuilder.group({
      passwordO: new FormControl('', Validators.compose([
        Validators.required
      ])),
      matching_passwords: this.matching_passwords_group
    });
  }

  cambiarPass(){
    this.loader = this.loadingCtrl.create();
    this.loader.present();
    // console.log("Cambio contraseña");
    if (this.cambioPassForm.get("passwordO").hasError('required') ||
    this.cambioPassForm.get('matching_passwords').get('passwordN').hasError('required') ||
    this.cambioPassForm.get('matching_passwords').get('passwordNC').hasError('required')) {
      // console.log("Completa todos los campos!!!");
      var texto = "Completa todos los campos!!!"
      this.doAlert("Error!", texto, "")
    } else {
      if (this.cambioPassForm.get('passwordO').errors &&
      this.cambioPassForm.get('passwordO').dirty) {
        this.doAlert("Error!!!","Escribe el correo correctamente", "")
      }
      else if (this.cambioPassForm.get('matching_passwords').get('passwordN').hasError('minlength')) {
        this.doAlert("Error!!!", "Contrase\u00F1a: "+this.validation_messages.passwordN[1]["message"], "")
      }
      else if (this.cambioPassForm.get('matching_passwords').get('passwordN').hasError('maxlength')) {
        this.doAlert("Error!!!", "Contrase\u00F1a: "+this.validation_messages.passwordN[2]["message"], "")
      }
      else if (this.cambioPassForm.get('matching_passwords').hasError("areEqual")) {
        this.doAlert("Error!!!", "Contrase\u00F1a: "+this.validation_messages.matching_passwords[0]["message"], "")
      }
      else {
        if (this.cambioPassForm.value.matching_passwords.passwordN == this.cambioPassForm.value.matching_passwords.passwordNC) {
          // console.log(this.usuario, this.token);
          let sha256O = CryptoJS.SHA256(this.cambioPassForm.value.passwordO)
          let sha256N = CryptoJS.SHA256(this.cambioPassForm.value.matching_passwords.passwordN)

          let datosCambioPass = {
            "usuario" : this.usuario,
            "oldPass" : sha256O.toString(CryptoJS.enc.Hex),
            "newPass" : sha256N.toString(CryptoJS.enc.Hex)
          }
          this.ds.actualizarPass(datosCambioPass, this.token)
          .subscribe(res =>{
            if (res["response"] == true) {
              // console.log("actualizado", res);
              let sub = "¡Contrase\u00F1a actualizada!"
              let mes = "Inicia sesi\u00F3n nuevamente"
              this.loader.dismiss();
              this.doAlertConfirm("Exito!",sub, mes)
            } else {
              // console.log("pass Incorrecto", res);
              this.loader.dismiss();
              this.doAlert("Error!!!", "Contrase\u00F1a incorrecta","")
            }
          }, error => {
            console.error("Error actualizarPass", error);
          })
        }
      }
    }
  }

  validation_messages = {
    'passwordN': [
      { type: 'required', message: 'Campo Requerido' },
      { type: 'minlength', message: 'M\u00EDnimo 5 caracteres' },
      { type: 'maxlength', message: 'M\u00E1ximo 20 caracteres' }
    ],
    'passwordNC': [
      { type: 'required', message: 'Campo Requerido' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'No coincide la contrase\u00F1a' }
    ],
    'passwordO': [
      { type: 'required', message: 'Campo Requerido' }
    ]
  };

  obtieneUsuario(){
    this.ds.getUser().then((user)=>{
      this.usuario = user
    }).catch((e: any) => console.log('Error getUser', e));
  }

  doAlert(titulo, sub, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: sub,
      message: texto,
      enableBackdropDismiss: false,
      buttons: ['Ok']
    });

    alert.present();
  }

  doAlertConfirm(titulo, sub, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: sub,
      message: texto,
      enableBackdropDismiss: false,
      buttons: [
        {
        text: 'Ok',
        handler: () => {
          this.navCtrl.setRoot(InicioLoginPage)
        }
      }]
    });

    alert.present();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CambioPassPage');
    this.obtieneUsuario();
  }
}
