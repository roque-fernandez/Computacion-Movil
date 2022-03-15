import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBooksPage } from './my-books.page';

const routes: Routes = [
  {
    path: '',
    component: MyBooksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyBooksPageRoutingModule {}
