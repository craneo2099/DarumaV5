import { CambioPassPage } from './../cambio-pass/cambio-pass';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AjustesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ajustes',
  templateUrl: 'ajustes.html',
})
export class AjustesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToCambioPass(){
    this.navCtrl.push(CambioPassPage);
  }

  eliminarCuenta(){
    console.log("Cuenta Eliminada");

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AjustesPage');
  }

}
