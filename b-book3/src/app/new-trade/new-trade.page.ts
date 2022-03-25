import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Trade } from '../shared/trade.interface';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-trade',
  templateUrl: './new-trade.page.html',
  styleUrls: ['./new-trade.page.scss'],
})
export class NewTradePage implements OnInit {

  trade: Trade = {
    uid: null,
    idUser1: null,
    idUser2: null,
    idBook1: null,
    idBook2: null,
    meet_point: null,
    loan_date: null,
    return_date: null,
    state: "Pendiente"
  }

  user:User = null;
  otherUser:User = null;

  otherUserBook:Book = null;
  mySelectedBook:Book = null;
  myBooks: Book[] = [];

  otherUserSubscriber: Subscription;
  otherUserName = null;
  
  misLibrosSubscriber: Subscription;
  otrosLibrosSubscriber: Subscription;

  direccion:String = null;

  constructor(
    private database: DatabaseService,
    private router: Router
  ) {
    const routerState = this.router.getCurrentNavigation().extras.state;
    this.user = getAuth().currentUser;
    this.otherUserBook = routerState as Book;
    this.getBookOwner();
    console.log(this.otherUserBook);
    this.getMyAvailableBooks();
    this.printBooks();
   }

  ngOnInit() {
  }

  //FUNCIONES PROPIAS DEL INTERCAMBIO

  //FUNCIONES DE LIBROS

  async getBookOwner(){
    this.otherUserSubscriber = (await this.database.getById("users",this.otherUserBook.userId)).subscribe( res => {
      if(res){
        this.otherUser = res.data() as User;
        this.otherUserName = this.otherUser.displayName;
        console.log(this.otherUser);
      }
    });
  }

  async getMyAvailableBooks(){
    this.misLibrosSubscriber = (await this.database.getBooksByUserId(this.user.uid)).subscribe( res => {
      if(res.length){
        this.myBooks = res as Book[];
        this.printBooks();
      }
    });
  }

  printBooks(){
    if(!!this.myBooks){
      this.myBooks.forEach((book) => {
        console.log("Titulo: ",book.title, "  || UserId: ", book.userId, "  || BookId: ", book.uid, );
      });
    }
  }

  printSelectedBook(){
    console.log(this.user.displayName, " ha seleccionado: ",this.mySelectedBook);
  }

}
