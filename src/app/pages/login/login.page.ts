import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/service/authetication.service';
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit 
{
  public regForm : FormGroup;
  private validationMessages = 
  {
    email: 
    [
      { type: 'required', message: 'El correo electrónico es requerido.' },
      { type: 'email', message: 'El correo electrónico debe ser válido.' }
    ],
    password: 
    [
      { type: 'required', message: 'La contraseña es requerida.' }
    ]
  };

  constructor(private formBuilder : FormBuilder, private loadingCtrl : LoadingController, private auth : AutheticationService, private router : Router, private toastController : ToastController) {
    this.regForm = this.formBuilder.group({
      email: ['',
        [
          Validators.required,
          Validators.email
        ]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit() {
  }

  public async OnLoginClick()
  {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (!this.regForm) 
    {
      return false;
    }

    if (this.regForm?.valid) 
    {
      const user = await this.auth.logIn(this.regForm.value.email, this.regForm.value.password).catch((error) => {
        console.log(error);
        loading.dismiss();
      })

      if (user) 
      {
        loading.dismiss();
        this.router.navigate(["/home"]);
      }
      else 
      {
        this.showMessage("¡Credenciales incorrectas!");
      }
    }
    else 
    {
      Object.keys(this.regForm?.controls).forEach(field => {
        const control = this.regForm?.get(field);

        if (control instanceof FormControl && !control.valid) 
        {
          const messages = this.validationMessages[field as keyof typeof this.validationMessages];
          let errorMessage = '';
          if (messages) 
          {
            for (const key in control.errors) {
              errorMessage += messages.find(x => x.type === key)?.message + " ";

            }
          }
          this.showMessage(errorMessage);
          loading.dismiss();
        }
      })
    }

    return true;
  }

  get errorControl()
  {
    return this.regForm?.controls;
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

  public OnFillFields(emailQuickAccess : string, passwordQuickAccess : string)
  {
    this.regForm.setValue(
      {
        email: emailQuickAccess,
        password: passwordQuickAccess
      }
    ) 
  }
}
