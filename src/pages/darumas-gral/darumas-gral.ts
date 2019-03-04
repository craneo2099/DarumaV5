import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { AddDarumaQrPage } from './../add-daruma-qr/add-daruma-qr';
import { DetalleDarumaPage } from './../detalle-daruma/detalle-daruma';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';


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
    public ds: DarumaServiceProvider,
    public menuCtrl: MenuController) {
    this.darumas = [];
  }

  goToDetalle(qrcode, token){
    //peticion de daruma y mandarlo
    let daruma = {
      "daruma" : {"qrcode" : qrcode}
    }
    //console.log("darumaMorph", daruma);

    this.ds.getDarumasDetalle(daruma, token)
    .subscribe(detalle =>{
      detalle["result"].forEach(element => {
        console.log("detalle1", element);
        // console.log("detalle2", ...element["descripcion"]);
        // console.log("detalle3", element["nombre"]);
        this.navCtrl.push(DetalleDarumaPage, {
          descripcion: element["descripcion"],
          nombre:      element["nombre"],
          fechaIni:    element["fechaInicio"],
          fechaFin:    element["fechaCompletado"],
          estado:      element["estado"],
          qrCode:      element["qrcode"],
          token:       this.toki
        });
      })
    }, error => {
      console.log("Error getDarumasDetalle", error);
    })
  }

  goToScanQr(){
    this.navCtrl.push(AddDarumaQrPage);
  }

  cargaDarumasLst(){
    // mandar llamar servicio para traer darumas
    this.ds.getToken().then((token)=>{
      this.toki = token
      this.ds.getDarumas(token).subscribe(daruma =>{
        console.log("EntraGetDarumas", daruma );
        // if()
        daruma["result"].forEach(element => {
          //console.log("qr ",element["qrcode"]," estado ",element["estado"]);
          this.darumas.push(element)
          //console.log("Darumalst", element);
        });
      }, error => {
        console.log("Error getDarumas", error);
      })
    }).catch((e: any) => console.log('Error getToken', e));
  }

  ionViewWillEnter(){
   this.cargaDarumasLst();
   console.log("Menu ",this.menuCtrl.isEnabled());
   if(this.menuCtrl.isEnabled() == false){
     this.menuCtrl.enable(true);
   }

  }

  ionViewDidLoad() {
  }

}
