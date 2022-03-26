import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeRequestsPage } from './trade-requests.page';

const routes: Routes = [
  {
    path: '',
    component: TradeRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeRequestsPageRoutingModule {}
