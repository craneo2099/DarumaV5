import { Storage } from '@ionic/storage';
import { DarumasGralPage } from './../darumas-gral/darumas-gral';
import { FormularioDarumaPage } from './../formulario-daruma/formulario-daruma';
import { DarumaServiceProvider } from './../../providers/daruma-service/daruma-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@IonicPage()
@Component({
  selector: 'page-add-daruma-qr',
  templateUrl: 'add-daruma-qr.html',
  providers: [DarumaServiceProvider]
})
export class AddDarumaQrPage {
  private isBackMode: boolean = false;
  private isFlashLightOn: boolean = false;
  private scanSub: any ;
  public loader: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public viewController: ViewController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public ds: DarumaServiceProvider) {
      this.loader = this.loadingCtrl.create();
      this.loader.present();
  }

  ionViewWillEnter(){
    this.showCamera();
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // console.log('Camera Permission Given');

          // start scanning
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            // console.log("Info QR: ", text);
            // console.log("PROCESO");
            //DarumasWS/asignar
            this.ds.getToken().then((token)=>{
              this.ds.isQrCodeRegistrado(text, token)
              .subscribe(res =>{
                // console.log("resExiste", res);
                if(res["result"] == true){
                  let mensaje = "Codigo Aceptado"
                  // console.log("existe");

                  /////////////Inicio////////////////////////
                  this.ds.isQrCodeAsignado(text, token)
                  .subscribe(res2 =>{
                    // console.log("res2", res2);
                    if(res2["result"] == false){
                  /////////////Fin/////////////////////////
                      // console.log("no esta usado");
                      //se almacena
                      let nuevoDaruma = {
                        "qrCode": text,
                        "token": token
                      }
                      this.storage.set("newDAruma", nuevoDaruma)
                      this.presentToast(mensaje);
                      this.goToFormDaruma();
                  ///////////////Inicio///////////////////////
                    }else{
                      let titulo = "Error!"
                      let texto = "El codigo ya ha sido usado"
                      this.doAlert(titulo, texto)
                      // quitar comentario
                      this.navCtrl.setRoot(DarumasGralPage)
                    }
                  }, error => {
                    console.log("Error isQrCodeAsignado",error);
                  })
                  ////////////////Fin////////////////////////

                }else{
                  let titulo = "Error!"
                  let texto = "El codigo es incorrecto"
                  this.doAlert(titulo, texto)
                  this.navCtrl.setRoot(DarumasGralPage)
                }
              }, error => {
                console.log("Error isQrCodeRegistrado",error);
              })
            }).catch((e: any) => console.log('Error getToken', e));

          });//termina
          // show camera preview
          this.qrScanner.show();
          // console.log("Info 2 QR: ", this.qrScanner.show());
          // console.log("PREVISTA");

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          //alert
          console.log('Camera permission denied');
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          console.log('Permission denied for this runtime.');
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  closeModal() {
    if (this.navCtrl.canGoBack()){
      this.viewController.dismiss();
    } else {
      this.navCtrl.setRoot(DarumasGralPage);
    }
  }


  toggleFlashLight(){

    /** Default isFlashLightOn is false ,
     * enable it if false **/
    //console.log("flashI: ", this.isFlashLightOn);
    this.isFlashLightOn = !this.isFlashLightOn;
    //console.log("flash2: ", this.isFlashLightOn);
    if(this.isFlashLightOn){
      this.qrScanner.enableLight();
      //console.log("flashEntra: ", this.isFlashLightOn);
    }
    else{
      this.qrScanner.disableLight();
      //console.log("Sino: ", this.isFlashLightOn);
    }

  }
  toggleCamera(){
    /** Toggle Camera , Default is isBackMode is true , toggle
     * to false to enable front camera and vice versa.
     *
     * @type {boolean}
     */
    //console.log("camO", this.isBackMode);
    this.isBackMode =  !this.isBackMode;
    //console.log("camN", this.isBackMode);
    if(this.isBackMode){
      this.qrScanner.useFrontCamera();
      //console.log("camEntra", this.isBackMode);
    }
    else{
      this.qrScanner.useBackCamera();
      //console.log("camSino", this.isBackMode);
    }
  }

  presentToast(text:string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  doAlert(titulo, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['Ok']
    });

    alert.present();
  }

  ionViewWillLeave(){
    this.qrScanner.hide(); // hide camera preview
    this.scanSub.unsubscribe(); // stop scanning
    this.hideCamera();
  }
  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  goToFormDaruma() {
    this.navCtrl.push(FormularioDarumaPage);
  }

  ionViewDidLoad(){
    this.loader.dismiss();
  }
}
