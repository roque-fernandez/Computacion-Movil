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

  flagActualizacion = false;

  constructor(
    private database: DatabaseService, 
    private router: Router,
    private toastController: ToastController) {

    this.user = getAuth().currentUser;
    console.log("User en profile->",this.user);
    console.log("Existe nombre ->",!!this.user.displayName);
    this.initializeUser();
    
  }



  ngOnInit() {
  }

  initializeUser(){
    //si el usuario no tiene foto se le asigna una por defecto
    if(!!this.user.photoURL === false){
      console.log("Falta la foto de perfil")
      this.user.photoURL = "https://firebasestorage.googleapis.com/v0/b/proyecto-cm-2022.appspot.com/o/profileDefaultImage%2Fuser-default-image.jpg?alt=media&token=384b0ce0-87d5-40ec-ae66-6e54c0bfbaab";
      this.flagActualizacion = true;
    }

    //si el usuario no tiene foto se le asigna una por defecto
    if(!!this.user.displayName === false){
      var emailSeparado = this.user.email.split('@');
      this.user.displayName = emailSeparado[0];
      this.flagActualizacion = true;
      console.log("Nombre asignado ->",this.user.displayName);
    }

    if(this.flagActualizacion){
      this.editProfile();
      console.log("Se han asignado automaticamente nombre o/y foto de perfil");
    }
  }

  //actualiza en firebase el usuario actual
  editProfile(){
    this.database.update('users', this.user.uid ,  JSON.parse(this.userToJSON())).then(res => {
      console.log(res);
      this.router.navigate(['profile']);
    }).catch(err => {
      console.log(err);
    });
  }

  //devuelve el objeto User en formato JSON
  userToJSON(){
    var res = '{ "displayName": ' + '"' + this.user.displayName + '"' + ', "email":'  + '"' + this.user.email + '"' + ', "emailVerified": ' + this.user.emailVerified + ', "photoURL":' + '"' + this.user.photoURL + '"' + ', "uid":'  + '"' + this.user.uid + '"' + "}";
    return res;
  }

  async presentToast(content) {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000
    });
    toast.present();
  }



}
