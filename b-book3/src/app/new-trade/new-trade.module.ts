import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTradePageRoutingModule } from './new-trade-routing.module';

import { NewTradePage } from './new-trade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTradePageRoutingModule
  ],
  declarations: [NewTradePage]
})
export class NewTradePageModule {}
