import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CambioPassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cambio-pass',
  templateUrl: 'cambio-pass.html',
})
export class CambioPassPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  cambiarPass(){
    console.log("Cambio contraseña");

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CambioPassPage');
  }

}
