import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTradeChatPageRoutingModule } from './new-trade-chat-routing.module';

import { NewTradeChatPage } from './new-trade-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTradeChatPageRoutingModule
  ],
  declarations: [NewTradeChatPage]
})
export class NewTradeChatPageModule {}
