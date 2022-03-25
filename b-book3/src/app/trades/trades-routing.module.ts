import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradesPage } from './trades.page';

const routes: Routes = [
  {
    path: '',
    component: TradesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradesPageRoutingModule {}
