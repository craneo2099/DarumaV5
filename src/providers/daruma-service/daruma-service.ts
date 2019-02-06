import { qrAsignarInt } from './../../Interfaces/qrAsignar-Int';
import { getDarumasDatosInt } from './../../Interfaces/getDaruDatos-Int';
import { loginInt } from './../../Interfaces/login-Int';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class DarumaServiceProvider {
  public darumaUrl: string;
  public datosLogin: loginInt;
  public tok: string;
  datos: getDarumasDatosInt;
  datosAsignar: qrAsignarInt;

  public respuesta: any;

  constructor(public http: HttpClient,
    private storage: Storage
    ) {
    //console.log('Hello DarumaServiceProvider Provider');
    //produccion
    //this.darumaUrl = "http://koinobori-artesanias.com/darumas/public/";
    //Proxy pruebas
    this.darumaUrl = "/darumaUrl/";
  }

  doLogin(loginData){
    console.log("provider", loginData);
    this.datosLogin = loginData;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": ""
      })
    };
    //console.log("datosLogin", this.datosLogin);

    this.respuesta = this.http.post(
      this.darumaUrl + "loginApp/login" ,
      this.datosLogin, httpOptions)
    // console.log("respuesta",this.respuesta);
    // this.respuesta.subscribe(res =>{
    //    console.log("res", res);

    // })


  return this.respuesta = this.http.post(
    this.darumaUrl + "loginApp/login" ,
    this.datosLogin, httpOptions)
  }

  getToken(){
    return this.storage.get('tokenS')
  }

  getNewDaruma(){
    return this.storage.get('newDAruma')
  }

  getDarumas(token){
    console.log("tokInGetDar", token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        "Authorization": token
      })
    };

    this.datos = {
      clave: null,
      darumas:null
    }
    return this.http.post(this.darumaUrl + "DarumasWS/getDarumas",
    this.datos, httpOptions)
  }

  getDarumasDetalle(daruma, token){
    console.log("tokInGetDar", token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        "Authorization": token
      })
    };
    return this.http.post(this.darumaUrl + "DarumasWS/getDarumas",
    daruma, httpOptions)
  }
  isQrCodeRegistrado(qrCode, token){
    console.log("qrText", qrCode);

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": token
      })
    };
    this.datosAsignar = {
      "qrCode": qrCode,
    }
    // return this.http.post(this.darumaUrl + "DarumasWS/asignar", this.datosAsignar
     return this.http.get(this.darumaUrl + "QrCodeWS/isQrCodeRegistrado"+"?qrCode"+"="+qrCode
    //return this.http.get(this.darumaUrl + "QrCodeWS/isQrCodeAsignado"+"?qrCode"+"="+qrCode
    ,httpOptions)
  }

  isQrCodeAsignado(qrCode, token){
    console.log("qrText22", qrCode);

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": token
      })
    };
    this.datosAsignar = {
      "qrCode": qrCode

    }
    return this.http.get(this.darumaUrl + 'QrCodeWS/isQrCodeAsignado'+'?qrCode'+'='+qrCode
    ,httpOptions)
  }

  requerirPass(correo){
    console.log("Correo", correo);

    return this.http.get(this.darumaUrl + "loginApp/requerirPass?email="+correo)

  }

  isAsignaDaruma(qrCode: string, token: string){
    console.log("qrText", qrCode);
    console.log("qrToken", token);

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": token
      })
    };
    this.datosAsignar = {
      "qrCode": qrCode
    }
    return this.http.post(this.darumaUrl + "DarumasWS/asignar", this.datosAsignar
    ,httpOptions)
    // .subscribe(res =>{
    //   console.log("res", res);

    // })
  }

  doActivaDaruma(daruma, proposito, nombre){
    //console.log("EntraActivar", proposito);
    // console.log("EntraToken", daruma["token"]);
    // console.log("EntraQR", daruma["qrCode"]);
    let tok: string = daruma["token"]
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": tok
      })
    };
    // console.log("httpOptions",httpOptions);

    let Daruma = {
      "qrcode": daruma["qrCode"],
      "descripcion": proposito,
      "nombre": nombre
    }
    // console.log("ActivaJSON",Daruma);

    return this.http.post(this.darumaUrl + "DarumasWS/activar", Daruma
    ,httpOptions)

  }
}
