import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { loginInt } from './../../Interfaces/login-Int';
import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

//import { FormularioDarumaPage } from './../formulario-daruma/formulario-daruma';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Keyboard, MenuController } from 'ionic-angular';
import { RegistroPage } from '../registro/registro';
import { RecuperarPage } from '../recuperar/recuperar';
import { DarumasGralPage } from '../darumas-gral/darumas-gral';


@IonicPage()
@Component({
  selector: 'page-inicio-login',
  templateUrl: 'inicio-login.html',
  providers: [DarumaServiceProvider]
})
export class InicioLoginPage {
  public loginForm: FormGroup;
  private datosLogin: loginInt;
  public token: string;
  keyboard: Keyboard;
  minLength = 5;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public storage: Storage,
    public datePipe: DatePipe,
    public menuCtrl: MenuController
    ) {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])],
        password: ['', Validators.compose([Validators.required
          /*,Validators.minLength(4)*/
        ])]
      });
      this.storage.remove('tokenS')
      this.menuCtrl.enable(false)
    }



  logForm(){
    //console.log(this.loginForm.value);
    //console.log(this.loginForm.value.email);
    if (this.loginForm.get('email').hasError('required') || this.loginForm.get('password').hasError('required')) {
      console.log("campo nulo");
      let error="Error!"
      let texto="Escribe tu Usuario (e-mail) y/o Password";
      this.doAlert(error, texto);
    } else {
      //console.log("datos completos");
      if (this.loginForm.get('email').errors &&
      this.loginForm.get('email').dirty &&
      this.loginForm.get('email').hasError('pattern')) {
      //  console.log("No entra");
       this.doAlert("Error!!!","Escribe el correo correctamente")
      } else {
        // let f = new Date()
        let z = this.datePipe.transform(new Date(), 'Z')
        // console.log("timeZone ",  z);
        this.datosLogin = {
          usuario: this.loginForm.value.email,
          pass: this.loginForm.value.password,
          zona: z
        }
        this.ds.doLogin(this.datosLogin)
        .subscribe(data => {
          console.log("data InLog.ts",data);
          if (data["response"]==false) {
            console.log("datos Incorrectos");

            let error="Error!!!";
            // this.doAlert(error, data["message"])
            this.doAlert(error, "Usuario o contrseña incorrecto")
          } else {

            this.storage.set('tokenS', data["result"]);
            this.storage.set('userS', this.loginForm.value.email)
            this.navCtrl.setRoot(DarumasGralPage);
          }
        }, error => {
          console.log("errooor",error);
          // console.log("A",error["text"]);
          // console.log("B",error["error"]);
          // console.log("C",error["error"]["text"]);
        });
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

  goToRegistro() {
    this.navCtrl.push(RegistroPage);
  }

  goToRecuperar(){
    this.navCtrl.push(RecuperarPage);
  }

  ionViewDidLoad() {
    // tiene que checar si hay un token activo
    // y saltar la pantalla de login
    //console.log('ionViewDidLoad InicioLoginPage');
  }

}
