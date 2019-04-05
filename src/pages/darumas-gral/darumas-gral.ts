import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/';
import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { AddDarumaQrPage } from './../add-daruma-qr/add-daruma-qr';
import { DetalleDarumaPage } from './../detalle-daruma/detalle-daruma';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,
  LoadingController, Platform, AlertController } from 'ionic-angular';

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
  public loader: any;
  public usuario;
  public noDarumaFlag;
  public darumasIncompletos: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ds: DarumaServiceProvider,
    public loadingCtrl: LoadingController,
    private localNotifications: LocalNotifications,
    private plt: Platform,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController) {
    //this.alertOfNotification();

  }

  scheduleNotification(){
    // console.log("EntraNoti");
    if (this.darumasIncompletos == true) {
      // console.log("DarumasIncompletos", this.darumasIncompletos);
      this.localNotifications.hasPermission()
      .then(permiso => {
        //verifica permiso para notificaciones
        // console.log("TienePermisoNotif", permiso);
        if (permiso == true) {
          // tiene permiso
          // console.log("Programa Notificaciones");
          this.localNotifications.schedule({
            id: 1,
            title: 'Tienes Darumas activos',
            text: '\u00A1Cumple tus prop\u00F3sitos!',
            // trigger: { at: new Date(new Date().getTime() + 5 * 1000) },
            trigger: { every: ELocalNotificationTriggerUnit.WEEK, count: 5 },
            data: {myData: this.usuario},
            led: { color: '#FF005E', on: 500, off: 500 } ,
            icon: 'file://assets/imgs/icoNoti2.png',
            smallIcon: 'res://ic_no'
          });
        } else {
          // no tiene permiso Notificaciones
          this.localNotifications.requestPermission( )
          .then(permisoRquest => {
            //pide permiso Notificaciones
            console.log("NotifRequest", permisoRquest);
          }).catch((e: any) => console.log('Error requestPermissionNotif', e));
        }
      }).catch((e: any) => console.log('Error permisoNotif', e));
    }
  }

  verficaNotiYBorra(){
    //verifica si ya hay una notificacion
    this.localNotifications.getAll()
    .then(obtnNoti => {
      if (obtnNoti.length == 0) {
        // console.log("obtnNoti: nada");
      } else {
        // console.log("obtnNoti", obtnNoti);
        // console.log("obtnNotiData", JSON.parse(obtnNoti["0"].data)["myData"]);
        this.localNotifications.cancelAll()
        .then(cancelNoti => {
          // console.log("cancelNoti",cancelNoti);
          this.localNotifications.clearAll()
          .then(clearNoti => {
            // console.log("limpiaNoti", clearNoti);
          }).catch((e: any) => console.log('Error clearAllNotif', e));
        }).catch((e: any) => console.log('Error cancelAllNotif', e));
      }
    }).catch((e: any) => console.log('Error getAllNotif', e));
  }

  goToDetalle(qrcode, token){
    //peticion de daruma y mandarlo
    this.loader = this.loader = this.loadingCtrl.create();
    this.loader.present();
    let daruma = {
      "daruma" : {"qrcode" : qrcode}
    }

    this.ds.getDarumasDetalle(daruma, token)
    .subscribe(detalle =>{
      detalle["result"].forEach(element => {
        console.log("detalle1", element);
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
    this.loader = this.loader = this.loadingCtrl.create();
    this.loader.present();
    // mandar llamar servicio para traer darumas
    this.ds.getToken().then((token)=>{
      this.toki = token
      this.ds.getDarumas(token).subscribe(daruma =>{
        console.log("EntraGetDarumas", daruma );
        if (daruma["result"].length == 0) {
          this.noDarumaFlag = true;
        }
        daruma["result"].forEach(element => {
          //console.log("qr ",element["qrcode"]," estado ",element["estado"]);
          this.darumas.push(element)
          if (element["estado"] == 6 && this.darumasIncompletos == false) {
            this.darumasIncompletos = true;
            this.scheduleNotification();
          }
        });
      }, error => {
        console.log("Error getDarumas", error);
      }, () => {
        this.loader.dismiss();
      })
    }).catch((e: any) => console.log('Error getToken', e));
  }

  obtieneUsuario(){
    this.ds.getUser().then((user)=>{
      this.usuario = user
    }).catch((e: any) => console.log('Error getUser', e));
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

  alertOfNotification(){
    this.plt.ready().then (() =>{
      this.localNotifications.on('trigger').subscribe (ras =>{
        //let user = ras.data ? ras.data.myData : '';
        // console.log("msgOC",user);
        this.doAlert(ras.title, "", ras.text);
      }, error => {
        // console.log("Error triggerNotifCons", error);
      });
    }).catch((e: any) => console.log('Error pltReadycons', e));

  }

  ionViewWillEnter(){
    this.obtieneUsuario();
    this.noDarumaFlag = false;
    this.darumasIncompletos = false;
    this.verficaNotiYBorra();
  }

  ionViewDidEnter(){
    this.darumas = [];
    this.cargaDarumasLst();
  }

  ionViewDidLoad() {
    if(this.menuCtrl.isEnabled() == false){
      this.menuCtrl.enable(true);
    }
  }

  ionViewDidLeave(){
   this.loader.dismiss();
  }
}
