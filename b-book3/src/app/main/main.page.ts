import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { DatabaseService } from '../services/database.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  user:User = null;

  librosBuscados: Book[] = [];

  librosBuscadosSubscriber: Subscription;

  flagActualizacion = false;

  constructor(private menu: MenuController,
    private database: DatabaseService,
    private router: Router) { 
      this.user = getAuth().currentUser;
      console.log("User en MAIN->",this.user);
      console.log("Existe nombre ->",!!this.user.displayName);
      this.initializeUser();
      this.getSearch();
      this.printBooks();
    }

  ngOnInit() {
  }

  async getSearch(){
    this.librosBuscadosSubscriber = (await this.database.getBooksByUserId("books","!=",this.user.uid)).subscribe( res => {
      if(res.length){
        this.librosBuscados = res as Book[];
      }
    });
  }

  printBooks(){
    if(!!this.librosBuscados){
      this.librosBuscados.forEach((book) => {
        console.log("Titulo: ",book.title, "  || UserId: ", book.userId, "  || BookId: ", book.uid, );
      });
    }
  }

  //FUNCION QUE DA VALORES POR DEFECTO AL USUARIO SI LE FALTA FOTO DE PERFIL O NOMBRE

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
    }).catch(err => {
      console.log(err);
    });
  }

  //devuelve el objeto User en formato JSON
  userToJSON(){
    var res = '{ "displayName": ' + '"' + this.user.displayName + '"' + ', "email":'  + '"' + this.user.email + '"' + ', "emailVerified": ' + this.user.emailVerified + ', "photoURL":' + '"' + this.user.photoURL + '"' + ', "uid":'  + '"' + this.user.uid + '"' + "}";
    return res;
  }

  
  //FUNCIONES DE MANEJO DEL MENU

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

}
