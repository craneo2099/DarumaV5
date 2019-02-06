import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormularioDarumaPage } from './formulario-daruma';

@NgModule({
  declarations: [
    FormularioDarumaPage,
  ],
  imports: [
    IonicPageModule.forChild(FormularioDarumaPage),
  ],
})
export class FormularioDarumaPageModule {}
