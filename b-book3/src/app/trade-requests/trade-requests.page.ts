import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Trade } from '../shared/trade.interface';
import { Request } from '../shared/request.interface';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-trade-requests',
  templateUrl: './trade-requests.page.html',
  styleUrls: ['./trade-requests.page.scss'],
})
export class TradeRequestsPage implements OnInit {

  user:User = null;

  requests: Request[] = [];
  trades: Trade[] = [];

  tradeSubscriber: Subscription;
  requestSubscriber: Subscription;

  constructor(
    private database: DatabaseService,
    private router: Router,
    private toastController: ToastController
  ) { 
    this.user = getAuth().currentUser;
    this.getTrades();
    
  }

  ngOnInit() {
  }

  async getTrades(){
    this.tradeSubscriber = (await this.database.getTradeRequests(this.user.uid)).subscribe( res => {
      if(res.length){
        this.trades = res as Trade[];
        console.log("Se han obtenido las solicitudes de intercambio: ",this.trades);
        this.getRequests();
      }
    });
  }

  async getRequests(){
    this.trades.forEach( async (trade) => {
      console.log("Trade en getRequests: ",trade);
      var request:Request = {
        uid: '',
        user1: null,
        user2: null,
        book1: null,
        book2: null,
        meet_point: '',
        loan_date: null,
        return_date: null,
        state: ''
      };
      
      //obtenemos los libros
      this.requestSubscriber = (await this.database.getById("books",trade.idBook1)).subscribe(res => {
        if(res){
          request.book1 = res.data() as Book;
        }
      });
      this.requestSubscriber = (await this.database.getById("books",trade.idBook2)).subscribe(res => {
        if(res){
          request.book2 = res.data() as Book;
        }
      });

      //obtenemos los usuarios
      this.requestSubscriber = (await this.database.getById("users",trade.idUser1)).subscribe(res => {
        if(res){
          request.user1 = res.data() as User;
        }
      });
      this.requestSubscriber = (await this.database.getById("users",trade.idUser2)).subscribe(res => {
        if(res){
          request.user2 = res.data() as User;
        }
      });

      //obtenemos el resto de datos
      
      request.loan_date = trade.loan_date;
      request.meet_point = trade.meet_point;
      request.return_date = trade.return_date;
      request.state = trade.state;
      request.uid = trade.uid;
      

      this.requests.push(request);
      
    });
    console.log("Se han obtenido las siguientes Requests: ",this.requests);
  }

  
  async acceptRequest(request){
    var result = this.trades.filter(trade =>
      trade.uid == request.uid
    );
    if(result.length > 0){
      result[0].state = "Aceptado";

      //se modifica de los dos libros a disponible (inicia el intercambio)
      request.book1.availability = "Prestado";
      this.updateBook(request.book1);
      request.book2.availability = "Prestado";
      this.updateBook(request.book2);

      this.database.update('trades', result[0].uid ,  JSON.parse(this.tradeToJSON(result[0]))).then(res => {
        this.presentToast("Solicitud de intercambio aceptada");
        this.router.navigate(['trades']);
      }).catch(err => {
        console.log(err);
      });
    }
  }

  async presentToast(content) {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000
    });
    toast.present();
  }
  

  printTrades(){
    console.log("TRADES ->",this.trades);
  }

  tradeToJSON(trade){
    var res = '{ "uid": ' + '"' + trade.uid + '"' 
    + ', "idUser1":'  + '"' + trade.idUser1 + '"' 
    + ', "idUser2": ' + '"' + trade.idUser2 + '"' 
    + ', "idBook1":' + '"' + trade.idBook1 + '"' 
    + ', "idBook2":'  + '"' + trade.idBook2 + '"' 
    + ', "meet_point":'  + '"' + trade.meet_point + '"'
    + ', "loan_date":'  + '"' +  trade.loan_date + '"'
    + ', "return_date":'  + '"' +  trade.return_date + '"'
    + ', "state":'  + '"' + trade.state + '"'
    + "}";
    //console.log(res);
    return res;
  }

  async updateBook(book:Book){
    this.database.update('books', book.uid ,  JSON.parse(this.bookToJSON(book))).then(res => {
      console.log("Exito actualizando libro");
    }).catch(err => {
      console.log("Fallo actualizando libro");
    });
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

}
