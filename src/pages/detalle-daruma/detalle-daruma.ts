import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetalleDarumaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-daruma',
  templateUrl: 'detalle-daruma.html',
})
export class DetalleDarumaPage {
  public darumaId: number;
  public proposito:   number;
  public estatus: number;
  public nombre: string;
  public fechaIni: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
      //console.log(navParams.get("darumaId"));
      this.nombre = navParams.get("nombre");
      this.proposito = navParams.get("descripcion");
      this.fechaIni = navParams.get("fechaIni");
      //cambia segun estado
      //this.estatus = 1;

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad DetalleDarumaPage');
    // console.log("detalle: ", this.darumaId, this.userID);

  }

}
