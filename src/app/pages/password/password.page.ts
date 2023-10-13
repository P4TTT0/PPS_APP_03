import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AutheticationService } from 'src/app/service/authetication.service';
import { Howl } from 'howler';
import { Haptics } from '@capacitor/haptics';
import { Flashlight } from '@awesome-cordova-plugins/flashlight';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {


  constructor(private modalController: ModalController,  private toastController : ToastController, private auth : AutheticationService) { }

  password: string = '';
  public alarm : Howl | any;

  async confirmPassword() 
  {
    let contraseñaCorrecta : boolean = await this.auth.verificarContraseña(this.password);
    if (contraseñaCorrecta) {
      this.showMessage('¡Alarma desactivada!');
      try{
        this.alarm.stop();
      }
      catch(error)
      {
        console.log("Error al apagar la alarma.")
      }
      await this.modalController.dismiss({ validated: true });
    } 

    else 
    {
      this.showMessage('¡Contraseña incorrecta!');
      try{
        await Haptics.vibrate({ duration: 5000 });
        await Flashlight.switchOn();
        setTimeout(async () => {
          // Apagar el flash después de 5 segundos
          await Flashlight.switchOff();
        }, 5000);
        let src : string = './../../assets/Alarmas/alarmaRuidosa.mp3'
          this.alarm = new Howl(
            {
              src: [src]
            }
          )
          this.alarm.play();
      }
      catch(error)
      {
        this.showMessage('¡Error!');
      }
      this.password = ''; 
    }
  }

  async closeModal() {
    await this.modalController.dismiss({ validated: false });
  }

  public async showMessage(message: string) 
  {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    })

    await toast.present();
  }

  ngOnInit(): void {

  }

}
