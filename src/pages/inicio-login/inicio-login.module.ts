import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioLoginPage } from './inicio-login';

@NgModule({
  declarations: [
    InicioLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(InicioLoginPage),
  ],
})
export class InicioLoginPageModule {}
