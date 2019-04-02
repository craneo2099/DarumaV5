import { InicioLoginPage } from './../inicio-login/inicio-login';
import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { CambioPassPage } from './../cambio-pass/cambio-pass';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Keyboard } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ajustes',
  templateUrl: 'ajustes.html',
})
export class AjustesPage {
  private token;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider,
    public keyboard: Keyboard,
    public alertCtrl: AlertController) {
  }

  goToCambioPass(){
    this.navCtrl.push(CambioPassPage,
      {token:       this.token});
  }

  eliminarCuenta(){
    let sub = "Estas a punto de eliminar tu cuenta"
    let mensaje = "¡Si continuas perder\u00E1s todos tus darumas y prop\u00F3sitos!"
    this.doAlertConfirm("Advertencia!!", sub, mensaje)
  }

  obtieneToken(){
    this.ds.getToken().then((token)=>{
      this.token = token
    }).catch((e: any) => console.log('Error getToken', e));
  }

  doAlert(titulo, sub, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: sub,
      message: texto,
      buttons: ['Ok']
    });

    alert.present();
  }

  doAlertConfirm(titulo, texto, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      message: mensaje,
      // enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Regresar',
          handler: () => {
            console.log("Regresa!!!");
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            console.log("token Eliminar cuenta", this.token);

            this.ds.eliminarCuenta(this.token).subscribe(res =>{
              console.log("cuenta Eliminada");
            }, error => {
              console.log("Error eliminarCuenta", error);
            })
            this.navCtrl.setRoot(InicioLoginPage)
          }
        }
      ]
    });

    alert.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AjustesPage');
    this.obtieneToken();
  }

}
