import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewTradeChatPage } from './new-trade-chat.page';

const routes: Routes = [
  {
    path: '',
    component: NewTradeChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewTradeChatPageRoutingModule {}
