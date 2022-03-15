import { Component, OnInit } from '@angular/core';
import { getAuth, updateProfile } from "firebase/auth";
import { User } from '../shared/user.interface';
import { DatabaseService } from '../services/database.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  user:User = null;

  newImage:any = null;

  constructor(
    private database: DatabaseService, 
    private router: Router,
    private firestorageService: StorageService,
    private toastController: ToastController
  ) { 
    this.user = getAuth().currentUser;
    this.newImage = this.user.photoURL;
    console.log("Usuario en editar perfil ->",this.user);
    console.log(this.userToJSON());
  }

  ngOnInit() {
  }

  
  editProfile(){
    if(this.profileReady()){
      this.database.update('users', this.user.uid ,  JSON.parse(this.userToJSON())).then(res => {
        console.log(res);
        this.router.navigate(['profile']);
      }).catch(err => {
        console.log(err);
      });

    }
  }
  
  
  
 /*
  editProfile(){
    if(this.profileReady()){
      updateProfile(getAuth().currentUser, {
        displayName: this.user.displayName, 
        photoURL: this.user.photoURL
      }).then(() => {
        console.log("Perfil correctamente actualizado");
        this.presentToast("Los cambios pueden tardar unos minutos en reflejarse");
        this.router.navigate(['profile']);
      }).catch((error) => {
        console.log("Error en la actualización del perfil ->",error);
      });
    }
  }
  */
  

  async uploadProfilePhoto(event: any){  
    this.newImageShow(event);

    var today = new Date();
    var date = today.getDate() + '_' + (today.getMonth()+1) + "_" + today.getFullYear() + "_" + today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();

    const path = 'profileImages';
    const name = this.user.email + "_" + date;
    const file = event.target.files[0];

    const url = await this.firestorageService.uploadPhoto(file,path,name);
    console.log("URL-> ", url);
    this.user.photoURL = url as string;
  }
  
  newImageShow(event:any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newImage = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0])
    }
  }

  profileReady(){
    if(!!this.user.displayName){
      console.log("El usuario tiene los campos necesarios");
      return true;
    }
    else{
      console.log("El usuario NO tiene los campos necesarios");
      this.presentToast('El nombre es necesario para la actualización');
      return false;
    }
  }

  async presentToast(content) {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000
    });
    toast.present();
  }

  userToJSON(){
    var res = '{ "displayName": ' + '"' + this.user.displayName + '"' + ', "email":'  + '"' + this.user.email + '"' + ', "emailVerified": ' + this.user.emailVerified + ', "photoURL":' + '"' + this.user.photoURL + '"' + ', "uid":'  + '"' + this.user.uid + '"' + "}";
    return res;
  }

}
