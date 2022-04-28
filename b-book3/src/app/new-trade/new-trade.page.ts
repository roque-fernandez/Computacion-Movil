import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Trade } from '../shared/trade.interface';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';


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
    private router: Router,
    public toastController: ToastController
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

  async uploadTrade(){
    this.trade.idUser1 = this.user.uid;
    this.trade.idBook1 = this.mySelectedBook.uid;
    this.trade.idUser2 = this.otherUser.uid;
    this.trade.idBook2 = this.otherUserBook.uid;

    if (this.tradeReady()){

      //se crea la entrada en la tabla de trades
      this.database.create('trades', this.trade).then(res => {
        console.log("Exito en alta de intercambio");

        this.router.navigate(['main']);

      }).catch(err => {
        console.log("Error en alta de intercambio: ", err);
      });
    }
  }

  tradeReady(){
    if(!!this.trade.idBook1 && 
      !!this.trade.idBook2 &&
      !!this.trade.meet_point && 
      !!this.trade.loan_date && 
      !!this.trade.return_date){
      console.log("El intercambio tiene los campos necesarios");
      console.log(this.trade);
      return true;
    }
    else{
      console.log("El intercambio NO tiene los campos necesarios");
      console.log(this.trade);
      this.presentToast('Faltan cambios del intercambio por elegir');
      return false;
    }
      
  }

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

  async updateBook(book:Book){
    this.database.update('books', book.uid ,  JSON.parse(this.bookToJSON(book))).then(res => {
      console.log("Exito actualizando libro");
    }).catch(err => {
      console.log("Fallo actualizando libro");
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

  bookToJSON(book:Book){
    var res = '{ "uid": ' + '"' + book.uid + '"' 
    + ', "userId":'  + '"' + book.userId + '"' 
    + ', "userDisplayName": ' + '"' + book.userDisplayName + '"' 
    + ', "title":' + '"' + book.title + '"' 
    + ', "author":'  + '"' + book.author + '"' 
    + ', "description":'  + '"' + book.description + '"'
    + ', "imageURL":'  + '"' + book.imageURL + '"'
    + ', "category":'  + '"' + book.category + '"'
    + ', "region":'  + '"' + book.region + '"'
    + ', "availability":'  + '"' + book.availability + '"'
    + ', "materialState":'  + '"' + book.materialState + '"'
    + "}";
    return res;
  }

  async presentToast(content) {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000
    });
    toast.present();
  }

}
