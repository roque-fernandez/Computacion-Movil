import { Component, OnInit } from '@angular/core';
import { userInfo } from 'os';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { Message } from '../shared/message.interface';
import { ChatPage } from '../chat/chat.page';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap } from "rxjs/operators";
import { User } from '../shared/user.interface';
import { DatabaseService } from '../services/database.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  currentUser:User = null;
  messages: Observable<Message[]>;
  usuarios: Observable<User[]>;
  private database: DatabaseService;


  

  constructor(private router: Router, private afs: AngularFirestore) { 
    this.currentUser = getAuth().currentUser;
    


    }

  ngOnInit() {
    this.getChatUsers();
    console.log(this.getChatUsers());
  }

  //FUNCION PARA OBTENER LOS USUARIOS

      getChatUsers(){
        this.usuarios = this.afs.collection('users').valueChanges({ idField: 'uid'}) as Observable<User[]>;
        return this.usuarios;
      }









}
