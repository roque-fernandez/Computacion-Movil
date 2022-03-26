import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.page.html',
  styleUrls: ['./book-view.page.scss'],
})
export class BookViewPage implements OnInit {

  book: Book = null;

  owner: User = null;
  ownerSubscriber: Subscription;
  
  ownerName = null;
  description = "Sin descripción";

  constructor(
    private router: Router,
    private database: DatabaseService
    ) { 
    
    }

  ngOnInit() {
    const routerState = this.router.getCurrentNavigation().extras.state;
    this.book = routerState as Book;
    this.getBookOwner();
    console.log(this.book);
    if(!!this.book.description){
      this.description = this.book.description;
    }  
  }

  async getBookOwner(){
    this.ownerSubscriber = (await this.database.getById("users",this.book.userId)).subscribe( res => {
      if(res){
        this.owner = res.data() as User;
        this.ownerName = this.owner.displayName;
        console.log(this.owner);
      }
    });
  }

}
