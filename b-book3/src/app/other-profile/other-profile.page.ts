import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.page.html',
  styleUrls: ['./other-profile.page.scss'],
})
export class OtherProfilePage implements OnInit {

  otherUser:User = null;
  otherUserSubscriber: Subscription;
  fotoPerfil = "https://firebasestorage.googleapis.com/v0/b/proyecto-cm-2022.appspot.com/o/profileDefaultImage%2Fuser-default-image.jpg?alt=media&token=384b0ce0-87d5-40ec-ae66-6e54c0bfbaab";
  otherUserName: string = null;
  otherUserId:String = null;
  otherUserEmail:String = null;

  otherUserBooks: Book[] = [];
  otherUserBooksSubscriber: Subscription;

  condicionDisponibilidad = "Disponible";

  constructor(
    private database: DatabaseService,
    private router: Router
    ) { 
      const routerState = this.router.getCurrentNavigation().extras.state;
      this.otherUserId = routerState as String;
      this.getOtherUser();
      this.getOtherUserBooks();
    }

  ngOnInit() {
  }

  //obtenemos el objeto User del perfil q vamos a mostrar
  async getOtherUser(){
    this.otherUserSubscriber = (await this.database.getById("users",this.otherUserId)).subscribe( res => {
      if(res){
        this.otherUser = res.data() as User;
        this.otherUserName = this.otherUser.displayName;
        this.otherUserEmail = this.otherUser.email;
        this.fotoPerfil = this.otherUser.photoURL;
        console.log(this.otherUser);
      }
    });
  }

  async getOtherUserBooks(){
    this.otherUserBooksSubscriber = (await this.database.getBooksByUserId(this.otherUserId)).subscribe( res => {
      if(res.length){
        this.otherUserBooks = res as Book[];
      }
    });
  }

}
