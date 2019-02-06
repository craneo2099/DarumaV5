import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleDarumaPage } from './detalle-daruma';

@NgModule({
  declarations: [
    DetalleDarumaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleDarumaPage),
  ],
})
export class DetalleDarumaPageModule {}
