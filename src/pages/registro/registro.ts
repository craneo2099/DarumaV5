import { PasswordValidatorProvider } from './../../providers/password-validator/password-validator';
import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { Component } from '@angular/core';
import { InicioLoginPage } from '../inicio-login/inicio-login';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  public registroForm: FormGroup;
  matching_passwords_group: FormGroup;
  public imgUrl;
  public tokenR;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder
    ) {
      //constructor
     this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.maxLength(20)
        /*Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')*/
      ])),
      passwordC: new FormControl('', Validators.required)
      }, (formGroup: FormGroup) => {
      return PasswordValidatorProvider.areEqual(formGroup);
      });
      this.registroForm = this.formBuilder.group({
        correo: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])),
        captcha: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6)
        ])),
        matching_passwords: this.matching_passwords_group
      });
  }
  enviarRegistro(){
    // console.log("correo", this.registroForm.value.correo);
    // console.log("pass", this.registroForm.value.matching_passwords.password);
    // console.log("passdC", this.registroForm.value.matching_passwords.passwordC);
    // console.log("captcha", this.registroForm.value.captcha);
    if (this.registroForm.get('correo').hasError('required') ||
    this.registroForm.get('matching_passwords').get('password').hasError('required') ||
    this.registroForm.get('matching_passwords').get('passwordC').hasError('required') ||
    this.registroForm.get('captcha').hasError('required')   ){
      console.log("Completa los campos!!!");
      var texto = "Completa los campos!!!"
      this.doAlert("Error!", texto)
    } else {
      if (this.registroForm.get('correo').errors &&
        this.registroForm.get('correo').dirty &&
        this.registroForm.get('correo').hasError('pattern')) {
        //  console.log("No entra");
         this.doAlert("Error!!!","Escribe el correo correctamente")
      }
      else if (this.registroForm.get('matching_passwords').get('password').hasError('minlength')) {
        this.doAlert("Error!!!", "Contrase\u00F1a: "+this.validation_messages.password[1]["message"])
      }
      else if (this.registroForm.get('matching_passwords').get('password').hasError('maxlength')) {
        this.doAlert("Error!!!", "Contrase\u00F1a: "+this.validation_messages.password[2]["message"])
      }
      else if (this.registroForm.get('matching_passwords').hasError("areEqual")) {
        this.doAlert("Error!!!", "Contrase\u00F1a: "+this.validation_messages.matching_passwords[0]["message"])
      }
      else if (this.registroForm.get('captcha').hasError('minlength')){
        this.doAlert("Error!!!", "Captcha: "+this.validation_messages.captcha[1]["message"])
      }
      else if (this.registroForm.get('captcha').hasError('maxlength')){
        this.doAlert("Error!!!", "Captcha: "+this.validation_messages.captcha[2]["message"])
      }
      else {
        if (this.registroForm.value.matching_passwords.password == this.registroForm.value.matching_passwords.passwordC) {
          let dataRegistro = {
            "usuario" : this.registroForm.value.correo,
            "correo"  : this.registroForm.value.correo,
            "word"    : this.registroForm.value.captcha,
            "pass"    : this.registroForm.value.matching_passwords.password
          }
          this.ds.doRegistrarUsuario(dataRegistro,this.tokenR)
          .subscribe(res =>{
            console.log("registroRes", res);
            if (res["response"] == true) {
              this.doAlertConfirm("Exito!",res["message"])
              console.log("Registrado!!");
            }
            else if (res["message"] == "El usuario no es humano" && res["response"] == false /*&& res["result"] == 3*/){
              this.doAlert("Alerta!","Verifica el Texto")
              console.log("Error Captcha");
            }
            else {
              this.doAlertConfirm("Error!!!",res["message"])
              console.log("Usuario ya registrado");
            }

          }, error => {
            console.log("error al registrar", error);
            //personalizar mensaje de error
            this.doAlert("Error!!!","Captcha incorrecto")
          })
        } else {
          console.log("pass diferentes");
        }

      }
    }
  }

  obtnerCaptchaTs(){
    this.ds.obtenerCaptcha()
    .subscribe(res =>{
      // console.log("resCap", res);
      // console.log("token", res["result"]["token"]);
      // console.log("captcha", res["result"]["captcha"]);
      this.imgUrl = res["result"]["captcha"];
      this.tokenR = res["result"]["token"];
    }, error => {
      console.log("error obtener Captcha",error);
    })
  }

  validation_messages = {
    'password': [
      { type: 'required', message: 'Campo Requerido' },
      { type: 'minlength', message: 'M\u00EDnimo 5 caracteres' },
      { type: 'maxlength', message: 'M\u00E1ximo 20 caracteres' }
      //{ type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'passwordC': [
      { type: 'required', message: 'Campo Requerido' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'No coincide la contrase\u00F1a' }
    ],
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
          this.navCtrl.setRoot(InicioLoginPage);
        }
      }]
    });

    alert.present();
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad RegistroPage');
    this.obtnerCaptchaTs();
  }

}
