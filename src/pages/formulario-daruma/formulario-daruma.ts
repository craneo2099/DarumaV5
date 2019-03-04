import { DarumasGralPage } from './../darumas-gral/darumas-gral';
import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-formulario-daruma',
  templateUrl: 'formulario-daruma.html',
  providers: [DarumaServiceProvider]
})
export class FormularioDarumaPage {
  public fecha
  public logdarumaForm: FormGroup

  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public ds: DarumaServiceProvider,
    public navParams: NavParams) {
      this.logdarumaForm = this.formBuilder.group({
          proposito: ['', Validators.compose([Validators.required])],
          nombreDaruma: ['', Validators.compose([Validators.required])]
      });
  }

  logdaruForm(){
    if (this.logdarumaForm.get('proposito').hasError('required') ||
    this.logdarumaForm.get('nombreDaruma').hasError('required')){
      // console.log("vacio");
      let titutlo="Error"
      let texto="Completa todos los campos"
      this.doAlert(titutlo, texto)
    }else{
      // Sacar token y QR
      this.ds.getNewDaruma().then((newDaruma)=>{
        // console.log("NewDarumaQr",newDaruma["qrCode"]);
        // console.log("NewDarumatoken",newDaruma["token"]);
        this.ds.isAsignaDaruma(newDaruma["qrCode"],newDaruma["token"])
        .subscribe(asigna =>{
          // console.log("asigna", asigna);
          // console.log("newDArumaAntesDe",newDaruma)
          this.ds.doActivaDaruma(newDaruma,
            this.logdarumaForm.value.proposito,
            this.logdarumaForm.value.nombreDaruma)
          .subscribe(resActiva =>{
            console.log("resActiva",resActiva);

            let result = resActiva["result"];
            if (result == 1) {
              this.doAlertConfirm("Exito!",resActiva["message"])
            }else {
              this.doAlertConfirm("Error!!!",resActiva["message"])
            }
          }, error => {
            console.log("Error doActivaDaruma",error);
          })
        }, error => {
          console.log("Error isAsignaDaruma",error);
        })
      }).catch((e: any) => console.log('Error is', e));

    }
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad FormularioDarumaPage');
    this.fecha = Date.now();
    //console.log("fecha", this.fecha);

  }


  doAlert(titulo, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      enableBackdropDismiss: false,
      buttons: ['Ok']
    });

    alert.present();
  }

  doAlertConfirm(titulo, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      enableBackdropDismiss: false,
      buttons: [
        {
        text: 'Ok',
        handler: () => {
          this.navCtrl.setRoot(DarumasGralPage);
        }
      }]
    });
    alert.present();
  }
}
