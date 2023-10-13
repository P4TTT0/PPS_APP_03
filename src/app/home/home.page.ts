import { Component } from '@angular/core';
import { AutheticationService } from '../service/authetication.service';
import { Router } from '@angular/router';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@awesome-cordova-plugins/device-motion';
import { ToastController } from '@ionic/angular';
import { Flashlight } from '@awesome-cordova-plugins/flashlight';
import { Howl } from 'howler'
import { Haptics } from '@capacitor/haptics';
import { ModalController } from '@ionic/angular';
import { PasswordPage } from '../pages/password/password.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  public data : any;
  subscription : any;
  public banderaVertical : boolean = false;
  public banderaIzquierda : boolean = false;
  public banderaDerecha : boolean = false;
  public banderaHorizontal : boolean = false;
  public alarmaActivada : boolean = false;
  public suscrito : boolean = false;
  public desbloqueando : boolean = false;
  public alarm : Howl | any;

  constructor(private auth : AutheticationService, private router : Router, private toastController : ToastController, private modalController: ModalController) {}

  public OnLogoutClick()
  {
    this.auth.logOut().then(() => {
      this.router.navigate(['/login'])
    });
  }

  async openModal() {
    this.desbloqueando = true;
    const modal = await this.modalController.create({
      component: PasswordPage,
      componentProps: {}
    });
  
    await modal.present();
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        const modalResult = data.data.validated; 
        if (modalResult) {
          this.subscription.unsubscribe();
          this.suscrito = false;
          this.alarmaActivada = false;
          try{

            this.alarm.stop();
            let src : string = './../../assets/Alarmas/alarmaDesactivada.mp3'
              this.alarm = new Howl(
                {
                  src: [src]
                }
              )
              this.alarm.play();
          }
          catch(error)
          {
    
          }
        } 
      }
      this.desbloqueando = false;
    });
  }

  public async startWatching()
  {
    if (this.suscrito) 
    {
      await this.openModal();
      return;
    }

    
    this.suscrito = true;
    this.alarmaActivada = true;
    var options : DeviceMotionAccelerometerOptions = 
    {
      frequency: 500
    };

    if(!this.desbloqueando)
    {
      this.subscription = DeviceMotion.watchAcceleration(options).subscribe(async (acceleration: DeviceMotionAccelerationData) => {
        this.data = acceleration;

        //Si está en horizontal
        if ((this.data.x < 1 && this.data.x > -1) && this.data.y < 1 && this.data.y > -1) 
        {
          if (!this.banderaHorizontal && (this.banderaDerecha || this.banderaIzquierda || this.banderaVertical)) {
            try {

              this.alarm.stop();
            }
            catch (error) {

            }
            await Haptics.vibrate({ duration: 5000 });
            this.banderaIzquierda = true;
            let src: string = './../../assets/Alarmas/soltame.mp3'
            this.alarm = new Howl(
              {
                src: [src]
              }
            )
            this.alarm.play();
          }
          this.banderaVertical = false;
          this.banderaIzquierda = false;
          this.banderaDerecha = false;
        }

        //Si está en VERTICAL
        if ((this.data.x > -1 && this.data.x < 2) && this.data.y > 1 && !this.banderaVertical) {
          this.banderaVertical = true;
          this.banderaHorizontal = false;
          try {

            this.alarm.stop();
          }
          catch (error) {

          }
          this.banderaIzquierda = true;
          let src: string = './../../assets/Alarmas/alarmaRelojViejo.mp3'
          this.alarm = new Howl(
            {
              src: [src]
            }
          )
          this.alarm.play();
          await Flashlight.switchOn();
          setTimeout(async () => {
            // Apagar el flash después de 5 segundos
            await Flashlight.switchOff();
          }, 5000);
        }

        //Si está mirando hacia la IZQUIERDA
        if (this.data.x > 2 && (this.data.y < 1 && this.data.y > -1) && !this.banderaIzquierda) {
          try {

            this.alarm.stop();
          }
          catch (error) {

          }
          this.banderaIzquierda = true;
          this.banderaHorizontal = false;
          let src: string = './../../assets/Alarmas/alarmaReloj.mp3'
          this.alarm = new Howl(
            {
              src: [src]
            }
          )
          this.alarm.play();
        }

        //Si está mirando hacia la DERECHA
        if (this.data.x < -2 && (this.data.y < 1 && this.data.y > -1) && !this.banderaDerecha) {
          try {

            this.alarm.stop();
          }
          catch (error) {

          }
          this.banderaDerecha = true;
          this.banderaHorizontal = false;
          let src: string = './../../assets/Alarmas/alarmaRuidosa.mp3'
          this.alarm = new Howl(
            {
              src: [src]
            }
          )
          this.alarm.play();
        }

      });
    }

  }

  public async showMessage(message: any) 
  {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    })

    await toast.present();
  }
}
