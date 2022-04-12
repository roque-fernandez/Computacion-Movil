import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Message } from '../shared/message.interface';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>;
  newMsg = '';
  otherUser: User = null;

  otherUserBook: Book = null;
  otherUserSubscriber: Subscription;
  otherUserName = null;

  constructor(private chatService: ChatService, private router: Router, private database: DatabaseService) { 
    const routerState = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  sendMessage(){
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  /*
  async getBookOwner(){
    this.otherUserSubscriber = (await this.database.getById("users",this.otherUserBook.userId)).subscribe( res => {
      if(res){
        this.otherUser = res.data() as User;
        this.otherUserName = this.otherUser.displayName;
        console.log(this.otherUser);
      }
    });
  }
  */  
}
