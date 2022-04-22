import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { StorageService } from '../services/storage.service';
import { Book } from '../shared/book.interface';
import { User } from '../shared/user.interface';
import { getAuth } from "firebase/auth";
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.page.html',
  styleUrls: ['./edit-book.page.scss'],
})
export class EditBookPage implements OnInit {

  libro: Book = null;

  newImage:any = null;

  user:User = null;
  

  //Comprobar campos necesarios *pendiente
  
  constructor(
    private database: DatabaseService, 
    private router: Router,
    private firestorageService: StorageService,
    public toastController: ToastController
    ) { 
      const routerState = this.router.getCurrentNavigation().extras.state;
      this.user = getAuth().currentUser;
      this.libro = routerState as Book;
      this.newImage = this.libro.imageURL;
      console.log("Editar libro ->",this.libro);
    }

  ngOnInit() {
   
  }

  //funcion que sube un libro a la base de datos
  uploadBook() {
    if(this.bookReady()){
      this.libro.userId = this.user.uid;
      this.libro.userDisplayName = this.user.displayName;

      this.database.create('books', this.libro).then(res => {
        console.log(res);
        this.router.navigate(['my-books']);
      }).catch(err => {
        console.log("Error en alta de libro: ", err);
      });
    }    
  }

  //funcion que sube una foto de un libro al storage
  //obtiene la url de dicha foto

  async uploadBookPhoto(event: any){  
    this.newImageShow(event);

    var today = new Date();
    var date = today.getDate() + '_' + (today.getMonth()+1) + "_" + today.getFullYear() + "_" + today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();

    const path = 'bookImages';
    const name = this.libro.title + "_" + date;
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

  

  //funcion que comprueba si el libro tiene los campos necesarios

  bookReady(){
    if(!!this.libro.title && !!this.libro.author && !!this.libro.imageURL && !!this.libro.region){
      console.log("El libro tiene los campos necesarios");
      return true;
    }
    else{
      console.log("El libro NO tiene los campos necesarios");
      this.presentToast('El título, el autor y la región son campos necesarios para la creación');
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

}
