import { Component, OnInit } from '@angular/core';
import { userInfo } from 'os';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { ChatService } from '../services/chat.service';
import { Message } from '../shared/message.interface';
import { ChatPage } from '../chat/chat.page';
import { User } from '../shared/user.interface';
import { DatabaseService } from '../services/database.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  user:User = null;
  mensajes: Message[] = [];
  chats: ChatService[] = [];
  usuarios: User[] = [];
  private database: DatabaseService;

  constructor() { 
      this.user = getAuth().currentUser;
      console.log("User en MAIN->",this.user);
      console.log("Existe nombre ->",this.user.displayName != null);

    }

  ngOnInit() {
    
  }


}
