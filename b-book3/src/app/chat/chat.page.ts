import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../shared/user.interface';
import { Message } from '../shared/message.interface';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { map, switchMap } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from "firebase/compat/app";
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>;
  newMsg = '';

  currentUser: User = null;

  otherUserId = null;

  constructor(private router: Router, private database: DatabaseService, private afs: AngularFirestore) { 
    const routerState = this.router.getCurrentNavigation().extras.state;
    console.log(routerState.userId);
    this.currentUser = getAuth().currentUser;
    this.otherUserId = routerState.userId || routerState.uid;
    console.log(this.otherUserId);
  }

  ngOnInit() {
    this.messages = this.getChatMessages(this.currentUser.uid,this.otherUserId);
  }

  //FUNCION PARA AÑADIR UN MENSAJE AL CHAT

  sendMessage(){
    this.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  

  addChatMessage(msg) {
    return this.afs.collection('messages').add({
        msg,
        from: this.currentUser.uid,
        to: this.otherUserId,
        createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
    })
}

//FUNCION PARA OBTENER LOS USUARIOS

getUsers(){
  return this.afs.collection('users').valueChanges({ idField: 'uid'}) as Observable<User[]>;
}


//FUNCION PARA MOSTRAR EL NOMBRE DEL USUARIO EN LOS MENSAJES

getUserForMsg(msgFromId, users: User[]): string {
  for (let usr of users) {
      if (usr.uid == msgFromId){
          return usr.displayName;
      }
  }
  return 'Deleted';
}


//FUNCION QUE OBTIENE LOS MENSAJES DEL CHAT DEL USUARIO ACTUAL CON OTRO USUARIO

getChatMessages(currentUserId,otherUserId) {
  let users = [];

  return this.getUsers().pipe(
      switchMap(res => {
          users = res;
          console.log('all users: ', users);
          return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField : 'id' }) as Observable<Message[]>
      }),
      map(messages => {
          for(let m of messages) {
              
            m.fromName = this.getUserForMsg(m.from, users);
            m.myMsg = this.currentUser.uid === m.from;
          }
          console.log('all messages: ', messages);
          //Filtra los mensajes por usuario receptor y emisor
          return messages.filter((m) => (m.from == currentUserId && m.to == otherUserId) || (m.to == currentUserId && m.from == otherUserId));
      })
  )
}




}
