import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})

export class AutheticationService 
{
  constructor(public ngFireAuth : AngularFireAuth) { }

  public async logIn(email : string, password : string)
  {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  public async logOut()
  {
    return await this.ngFireAuth.signOut();
  }

  public async getProfile()
  {
    return await this.ngFireAuth.currentUser;
  }

  public async getUserEmail()
  {
    return new Promise<string | null>((resolve, reject) => 
    {
      this.ngFireAuth.authState.subscribe(user => {
        if (user) {
          resolve(user.email);
        } else {
          resolve(null); 
        }
      });
    });
  }

  async verificarContraseña(password: string): Promise<boolean> 
  {
    try 
    {
      const userEmail = await this.getUserEmail() || '';
      await this.ngFireAuth.signInWithEmailAndPassword(userEmail, password);
      
      return true;
    }
    catch (error) 
    {
      return false;
    }
  }
}
