import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService, Message } from '../services/chat.service';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>;
  newMsg = '';


  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  sendMessage(){
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }


}
