import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeRequestsPageRoutingModule } from './trade-requests-routing.module';

import { TradeRequestsPage } from './trade-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradeRequestsPageRoutingModule
  ],
  declarations: [TradeRequestsPage]
})
export class TradeRequestsPageModule {}
