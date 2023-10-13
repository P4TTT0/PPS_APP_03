import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';
import { DeviceMotion } from '@awesome-cordova-plugins/device-motion';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
