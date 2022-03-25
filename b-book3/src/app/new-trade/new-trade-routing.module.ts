import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewTradePage } from './new-trade.page';

const routes: Routes = [
  {
    path: '',
    component: NewTradePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewTradePageRoutingModule {}
