import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user:User = null;

  fotoPerfil = null;

  flagActualizacion = false;

  constructor(
    private database: DatabaseService, 
    private router: Router,
    private toastController: ToastController) {

    this.user = getAuth().currentUser;
    this.fotoPerfil = this.user.photoURL;
    
    
    
  }



  ngOnInit() {
  }

  

  async presentToast(content) {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000
    });
    toast.present();
  }



}
