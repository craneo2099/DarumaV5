import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { AddDarumaQrPage } from './../add-daruma-qr/add-daruma-qr';
import { DetalleDarumaPage } from './../detalle-daruma/detalle-daruma';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DarumasGralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-darumas-gral',
  templateUrl: 'darumas-gral.html',
  providers: [DarumaServiceProvider]
})
export class DarumasGralPage {
  public userID: number;
  darumas: any;
  toki: string;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider) {
    this.darumas = [];
  }

  goToDetalle(qrcode, token){
    //peticion de daruma y mandarlo
    let daruma = {
      "daruma" : {"qrcode" : qrcode}
    }
    console.log("darumaMorph", daruma);

    this.ds.getDarumasDetalle(daruma, token)
    .subscribe(detalle =>{
      detalle["result"].forEach(element => {
        // console.log("detalle1", element);
        // console.log("detalle2", ...element["descripcion"]);
        // console.log("detalle3", element["nombre"]);
        this.navCtrl.push(DetalleDarumaPage, {
          descripcion: element["descripcion"],
          nombre: element["nombre"],
          fechaIni: element["ultimaEdicion"]
        });

      })
    })

  }

  goToScanQr(){
    this.navCtrl.push(AddDarumaQrPage);
  }

  ionViewDidLoad() {
    // mandar llamar servicio para traer darumas
    this.ds.getToken().then((token)=>{
      this.toki = token
      this.ds.getDarumas(token).subscribe(daruma =>{
        //console.log("darEnGetDAr", daruma );
        daruma["result"].forEach(element => {
          //console.log("qr ",element["qrcode"]," estado ",element["estado"]);
          this.darumas.push(element)
          //console.log("Darumalst", element);

        });
      })
    })

    // .subscribe(data => {
    //   console.log("En servicio",data)
    // })
    // console.log(this.ds.getDarumas());
    //console.log('ionViewDidLoad DarumasGralPage');
  }

}
