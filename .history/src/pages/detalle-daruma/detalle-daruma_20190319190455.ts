import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DarumaServiceProvider } from '../../providers/daruma-service/daruma-service';


@IonicPage()
@Component({
  selector: 'page-detalle-daruma',
  templateUrl: 'detalle-daruma.html',
})
export class DetalleDarumaPage {
  public darumaId: number;
  public proposito:   number;
  public estado: number;
  public nombre: string;
  public fechaIni: any;
  public fechaFin: any;
  public qrCode: number;
  public token: string;
  public isEnabled = false;
  public darumas: any;
  public loader: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController

    ) {
      this.nombre =    navParams.get("nombre");
      this.proposito = navParams.get("descripcion");
      this.fechaIni =  navParams.get("fechaIni");
      this.fechaFin =  navParams.get("fechaFin");
      this.estado =    navParams.get("estado");
      this.qrCode =    navParams.get("qrCode");
      this.token =     navParams.get("token");
      if (this.estado == 8) {
        this.isEnabled = true;
      }
      this.darumas = []
  }

  cambiarEstado(){
    console.log("CambiarEstadoAA", this.estado);
    let sub = "¿Haz cumplido tu proposito?"
    let mensaje = "Si cambias a \"Completado\" tu Daruma ser\u00E1 finalizado!"
    if (this.estado != 6) {
      this.doAlertConfirm("Alerta!",sub, mensaje)
      this.fechaFin = Date.now();
    }
  }

  doAlertConfirm(titulo, texto, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      message: mensaje,
      buttons: [
        {
          text: 'Regresar',
          handler: () => {
            console.log("Regresa!!!");
            this.estado = 6;
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.loader = this.loadingCtrl.create();
            this.loader.present();
            this.ds.completarDaruma(this.qrCode, this.token)
            .subscribe( res => {
              console.log("completadoo", res);
              console.log("Estado ", this.estado);
              this.isEnabled = true;

            }, error => {
              console.log("Error completarDaruma", error);
            }, () =>{
              this.loader.dismiss();
              this.doAlert("\u00A1Felicidades!",
              "Lo haz conseguido", "\u00A1El Daruma est\u00E1 terminado!")
            })
          }
        }
    ]
    });
    alert.present();
  }

  doAlert(titulo, sub, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: sub,
      message: mensaje,
      buttons: ['Ok']
    });

    alert.present();
  }


  ionViewDidLoad() {

  }
}
