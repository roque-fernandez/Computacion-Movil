import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Book } from '../shared/book.interface';
import { User } from '../shared/user.interface';
import { getAuth } from "firebase/auth";
import { Router } from '@angular/router';



//Camara
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AlertController } from '@ionic/angular';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { userInfo } from 'os';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';

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


  //Comprobar campos necesarios *pendiente
  
  constructor(private database: DatabaseService, private router: Router, private camera: Camera,
    private alertCtrl: AlertController,
    private storage: AngularFireStorage) { 

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


  //subir imagenes

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

}
