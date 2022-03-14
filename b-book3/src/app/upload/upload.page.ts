import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { StorageService } from '../services/storage.service';
import { Book } from '../shared/book.interface';
import { User } from '../shared/user.interface';
import { getAuth } from "firebase/auth";
import { Router } from '@angular/router';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { AlertController } from '@ionic/angular';


//Camara
/*
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AlertController } from '@ionic/angular';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { userInfo } from 'os';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
*/

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {
  
  libro: Book = { 
    uid: null,
    userId: null,
    title: null,
    author: null,
    description: null,
    imageURL: null,
    category: null,
    region: null,
    availability: "Disponible",
    materialState: null
  };

  galleryOptions : CameraOptions = {
    sourceType: this.camera. PictureSourceType.PHOTOLIBRARY,
    destinationType : this.camera.DestinationType.FILE_URI,
    quality: 100,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  newImage:any = '';

  //Comprobar campos necesarios *pendiente
  
  constructor(
    private database: DatabaseService, 
    private router: Router,
    private firestorageService: StorageService,
    private camera: Camera,
    private alertCtrl: AlertController
    ) { 

    }

  ngOnInit() {
   
  }

  //funcion que sube un libro a la base de datos
  uploadBook() {
    const auth = getAuth();
    const user = auth.currentUser; 
    this.libro.userId = user.uid;
    

    this.database.create('books', this.libro).then(res => {
      console.log(res);
      this.router.navigate(['tab1']);
    }).catch(err => {
      console.log("Error en alta de libro: ", err);
    });
  }

  //funcion que sube una foto de un libro al storage
  //obtiene la url de dicha foto
  async uploadBookPhoto(event: any){
    
    this.newImageShow(event);

    const path = 'bookImages';
    const name = 'prueba'
    const file = event.target.files[0];

    const url = await this.firestorageService.uploadPhoto(file,path,name);
    console.log("URL-> ", url);
    this.libro.imageURL = url as string;
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
  

  /*
  async choosePhoto(){
    let alertBox = await this.alertCtrl.create({
      header: 'Se abrira la galeria',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.camera.getPicture(this.galleryOptions).then(res => {
              console.log("Resultado de escoger foto-> ",res);
              this.photo=res;
            })
          }
        }
      ]
    
    })
    await alertBox.present();       
  }
  */
  


  //subir imagenes

  /*
  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  async takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
      console.error(err);
    });
  }

  upload(): void {
    var currentDate = Date.now();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `Images/${currentDate}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(`Images/${currentDate}`, file);
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            this.showSuccesfulUploadAlert();
          }
          console.log(downloadURL);
        });
      })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  async showSuccesfulUploadAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'basic-alert',
      header: 'Uploaded',
      subHeader: 'Image uploaded successful to Firebase storage',
      message: 'Check Firebase storage.',
      buttons: ['OK']
    });

    await alert.present();
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }
  */

}
