import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookViewPage } from './book-view.page';

const routes: Routes = [
  {
    path: '',
    component: BookViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookViewPageRoutingModule {}
