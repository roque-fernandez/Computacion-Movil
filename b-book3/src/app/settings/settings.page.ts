import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { getAuth } from "firebase/auth";
import { Router } from '@angular/router';
import { User } from '../shared/user.interface';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  user:User = null;

  constructor(
    private authSvc: AuthService, 
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.user = getAuth().currentUser;
  }

  async logOut(){
    try {
      await this.authSvc.logout();
      this.router.navigate(['home']);
    } catch (error) {
      console.log('Error->', error);
    }
  }

  async passwordReset(){
    try {
      await this.authSvc.resetPassword(this.user.email);
      this.presentToast("Revise su email y cambie la contraseña");
      this.router.navigate(['home']);
    } catch (error) {
      console.log('Error->', error);
    }
  }

  async presentToast(content) {
    const toast = await this.toastController.create({
      message: content,
      duration: 3000
    });
    toast.present();
  }

}
