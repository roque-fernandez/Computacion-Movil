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
  currentUserId: String;
  messages: Observable<Message[]>;
  usuarios: Observable<User[]>;
  private database: DatabaseService;


  

  constructor(private router: Router, private afs: AngularFirestore) { 
    this.currentUser = getAuth().currentUser;
    this.currentUserId = this.currentUser.uid;
    


    }

  ngOnInit() {
    this.usuarios = this.getChatUsers(this.currentUserId);
    console.log('b: ',this.usuarios);
    console.log(this.currentUserId);
  }

  //FUNCION PARA OBTENER LOS USUARIOS

      getUsers(){
        return this.afs.collection('users').valueChanges({ idField: 'uid'}) as Observable<User[]>;
      }


      getChatUsers(currentUserId) {
        let users = [];
        let usuarios = [];
        return this.getUsers().pipe(
            switchMap(res => {
                users = res;
                return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField : 'id' }) as Observable<Message[]>
            }),
            map(messages => {
              messages.filter((m) => (m.from == currentUserId) || (m.to == currentUserId))
              for (let index = 0; index < messages.length; index++) {
                if(messages[index].from == currentUserId){
                  usuarios.push(messages[index].to);
                }else if(messages[index].to == currentUserId){
                  usuarios.push(messages[index].from);
                }
              }
              return users.filter((us) => usuarios.includes(us.uid));
            })
        )
      }



}
