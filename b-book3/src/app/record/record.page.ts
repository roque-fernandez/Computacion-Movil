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
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {

  user:User = null;

  requests: Request[] = [];
  //trades donde el usuario actual es el user1
  trades1: Trade[] = [];
  //trades donde el usuario actual es el user1
  trades2: Trade[] = [];
  //trades en general
  trades: Trade[] = [];

  tradeSubscriber: Subscription;
  requestSubscriber: Subscription;

  constructor(
    private database: DatabaseService,
    private router: Router,
    private toastController: ToastController
  ) { 
    this.user = getAuth().currentUser;
    this.getRecord();
    
  }

  ngOnInit() {
  }

  async getRecord(){
    this.tradeSubscriber = (await this.database.getRecord1(this.user.uid)).subscribe( res => {
      if(res.length){
        this.trades1 = res as Trade[];
        console.log("Trade1: ",this.trades1);
        this.trades = this.trades1.concat(this.trades2);
        console.log("Se ha obtenido el siguiente historial: ",this.trades);
        this.getRequests();
      }
    });

    this.tradeSubscriber = (await this.database.getRecord2(this.user.uid)).subscribe( res => {
      if(res.length){
        this.trades2 = res as Trade[];
        console.log("Trade2: ",this.trades2);
        this.trades = this.trades1.concat(this.trades2);
        console.log("Se ha obtenido el siguiente historial: ",this.trades);
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
        state: '',
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

}


