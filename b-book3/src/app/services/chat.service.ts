import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Message } from '../shared/message.interface';
import { Router } from '@angular/router';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as firebase from "firebase/compat/app";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';


@Injectable({
    providedIn: 'root'
})

export class ChatService{
    
    currentUser: User = null;
    otherUser: User = null;

    otherUserBook: Book = null;

    otherUserSubscriber: Subscription;
    otherUserName = null;

    constructor(private afAuth: AngularFireAuth, 
        private afs: AngularFirestore, 
        private database: DatabaseService, 
        private router: Router)  {
        this.afAuth.onAuthStateChanged( user => {
            console.log('Changed: ', user);
            this.currentUser = user;
        })
        const routerState = this.router.getCurrentNavigation().extras.state;
        this.otherUserBook = routerState as Book;
        this.getBookOwner();
        console.log(this.otherUserBook);
        
     }




     addChatMessage(msg) {
         return this.afs.collection('messages').add({
             msg,
             from: this.currentUser.uid,
             //to: this.otherUser.uid,
             createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
         })
     }

     getUsers(){
         return this.afs.collection('users').valueChanges({ idField: 'uid'}) as Observable<User[]>;
     }

     getUserForMsg(msgFromId, users: User[]): string {
         for (let usr of users) {
             if (usr.uid == msgFromId){
                 return usr.email;
             }
         }
         return 'Deleted';
     }

     getChatMessages() {
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
                    m.to = this.getUserForMsg(m.to, users);
                    m.myMsg = this.currentUser.uid === m.from;
                 }
                 console.log('all messages: ', messages);
                 return messages;
             })
         )
     }



     //Mensajes Filtrados por usuario actual y destino

     getUserMessages(currentUser,OtherUser){
         let messages = this.getChatMessages();     
         let messagesF;
         return messages.pipe(
            map(messages => {
                for(let m of messages) {
                  if((m.from == currentUser && m.to == OtherUser) ||
                        ((m.from == OtherUser && m.to == currentUser))){
                        messagesF.add(m);
                  }
                }
                console.log('mensajesFiltrados: ', messagesF);
                return messagesF;
            })
         )

     }

     async getBookOwner(){
        this.otherUserSubscriber = (await this.database.getById("users",this.otherUserBook.userId)).subscribe( res => {
          if(res){
            this.otherUser = res.data() as User;
            this.otherUserName = this.otherUser.displayName;
            console.log(this.otherUser);
          }
        });
      }
    
      
}

