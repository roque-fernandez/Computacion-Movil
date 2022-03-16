import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as firebase from "firebase/compat/app";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

export interface User{
    uid: string;
    email: string;
}

export interface Message {
    createdAt: firebase.default.firestore.FieldValue;
    id: string;
    from: string;
    msg: string;
    fromName: string;
    myMsg: boolean;
}


@Injectable({
    providedIn: 'root'
})

export class ChatService{
    currentUser: User = null;

    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
        this.afAuth.onAuthStateChanged( user => {
            console.log('Changed: ', user);
            this.currentUser = user;
        })
     }

     addChatMessage(msg) {
         return this.afs.collection('messages').add({
             msg,
             from: this.currentUser.uid,
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
                    m.myMsg = this.currentUser.uid === m.from;
                 }
                 console.log('all messages: ', messages);
                 return messages;
             })
         )
     }

}

