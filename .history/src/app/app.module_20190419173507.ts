import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CambioPassPage } from './../pages/cambio-pass/cambio-pass';
import { AjustesPage } from './../pages/ajustes/ajustes';
import { RecuperarPage } from '../pages/recuperar/recuperar';
import { DetalleDarumaPage } from './../pages/detalle-daruma/detalle-daruma';
import { AcercaPage } from './../pages/acerca/acerca';
import { RegistroPage } from './../pages/registro/registro';
import { FormularioDarumaPage } from './../pages/formulario-daruma/formulario-daruma';
import { DarumasGralPage } from './../pages/darumas-gral/darumas-gral';
import { AddDarumaQrPage } from './../pages/add-daruma-qr/add-daruma-qr';
import { InicioLoginPage } from './../pages/inicio-login/inicio-login';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';

import { Camera } from '@ionic-native/camera';
import { QRScanner } from '@ionic-native/qr-scanner';
import { DarumaServiceProvider } from '../providers/daruma-service/daruma-service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'

import { IonicStorageModule } from '@ionic/storage';
import { PasswordValidatorProvider } from '../providers/password-validator/password-validator';
import { DatePipe } from '@angular/common';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications';


@NgModule({
  declarations: [
    MyApp
    // ,
    // InicioLoginPage,
    // RegistroPage,
    // FormularioDarumaPage,
    // DarumasGralPage,
    // AddDarumaQrPage,
    // AcercaPage,
    // DetalleDarumaPage,
    // RecuperarPage,
    // AjustesPage,
    // CambioPassPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: "darumaBDM"

    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InicioLoginPage,
    RegistroPage,
    FormularioDarumaPage,
    DarumasGralPage,
    AddDarumaQrPage,
    AcercaPage,
    DetalleDarumaPage,
    RecuperarPage,
    AjustesPage,
    CambioPassPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    QRScanner,
    DatePipe,
    InAppBrowser,
    LocalNotifications,
    DarumaServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PasswordValidatorProvider

  ]
})
export class AppModule {}
