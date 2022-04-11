import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Trade } from '../shared/trade.interface';
import { Request } from '../shared/request.interface';
import { DatabaseService } from '../services/database.service';
import { Subscription } from 'rxjs';
import { getAuth } from "firebase/auth";



@Component({
  selector: 'app-trades',
  templateUrl: './trades.page.html',
  styleUrls: ['./trades.page.scss'],
})
export class TradesPage implements OnInit {

  user:User = null;

  requests: Request[] = [];
  trades: Trade[] = [];

  tradeSubscriber: Subscription;
  requestSubscriber: Subscription;

  constructor(
    private database: DatabaseService,

  ) { 
    this.user = getAuth().currentUser;
    this.getTrades();
  }

  ngOnInit() {
  }

  async getTrades(){
    this.tradeSubscriber = (await this.database.getTrades(this.user.uid)).subscribe( res => {
      if(res.length){
        this.trades = res as Trade[];
        console.log("Se han obtenido los INTERCAMBIOS: ",this.trades);
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

}
