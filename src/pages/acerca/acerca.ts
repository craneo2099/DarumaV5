import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@IonicPage()
@Component({
  selector: 'page-acerca',
  templateUrl: 'acerca.html',
})
export class AcercaPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser) {
  }

  abreInsta(){
    const browser = this.iab.create('https://www.instagram.com/koinoboriartesanias/', '_blank');

    //browser.executeScript(...);

    // browser.insertCSS(...);
    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    browser.close();
  }

  abreFace(){
    const browser = this.iab.create('https://www.facebook.com/Koinoboriartesanias/', '_blank');

    //browser.executeScript(...);

    // browser.insertCSS(...);
    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    browser.close();
  }

  abreSitio(){
    const browser = this.iab.create('https://www.koinobori-artesanias.com', '_blank');

    //browser.executeScript(...);

    // browser.insertCSS(...);
    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    browser.close();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AcercaPage');
  }
}
