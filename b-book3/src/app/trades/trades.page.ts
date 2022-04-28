import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Trade } from '../shared/trade.interface';
import { Request } from '../shared/request.interface';
import { DatabaseService } from '../services/database.service';
import { Subscription } from 'rxjs';
import { getAuth } from "firebase/auth";
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-trades',
  templateUrl: './trades.page.html',
  styleUrls: ['./trades.page.scss'],
})
export class TradesPage implements OnInit {

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

  condicionAceptado = "Aceptado";
  condicionFinalizado1 = "Finalizado1";
  condicionFinalizado2 = "Finalizado2";

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
    this.tradeSubscriber = (await this.database.getTrades1(this.user.uid)).subscribe( res => {
      if(res.length){
        this.trades1 = res as Trade[];
        console.log("Trade1: ",this.trades1);
        this.trades = this.trades1.concat(this.trades2);
        console.log("Se ha obtenido el siguiente historial: ",this.trades);
        this.getRequests();
      }
    });

    this.tradeSubscriber = (await this.database.getTrades2(this.user.uid)).subscribe( res => {
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

  displayButtons(state,flagUser1) {
    if(state === 'Aceptado'){
      //se muestra el boton de finalizar (ambos)
    }
    else if(state === 'Finalizado1' && flagUser1 == false){
      //se muestra el boton de aceptar (usuario2)
    }
    else if(state === 'Finalizado2' && flagUser1 == true){
      //se muestra el boton de aceptar (usuario1)
    }
  }

  //valor de aceptado es 0 (el estado pasa a finalizado1/2)
  //valor de aceptado es 1 (el estado pasa a cerrado)
  //valor de aceptado es 0 (el estado pasa a incidencia)
  async endTrade(request,userNumber,aceptado){
    var result = this.trades.filter(trade =>
      trade.uid == request.uid
    );
    if(result.length > 0){
      if(userNumber == 1 && aceptado == 0){
        result[0].state = "Finalizado1";
        console.log("El usuario 1 ha marcado como finalizado el intercambio");
      }
      else if (userNumber == 2 && aceptado == 0){
        result[0].state = "Finalizado2";
        console.log("El usuario 2 ha marcado como finalizado el intercambio");
      }
      else if(aceptado == 1){
        result[0].state = "Cerrado";
        //se modifica de los dos libros a disponible (acaba el intercambio)
        request.book1.availability = "Disponible";
        this.updateBook(request.book1);
        request.book2.availability = "Disponible";
        this.updateBook(request.book2);
        console.log("El usuario ha aceptado el fin del intercambio");

      }
      else if(aceptado == 2){
        result[0].state = "Incidencia";
        console.log("El usuario ha marcado INCIDENCIA en el intercambio");
      }
      
      this.database.update('trades', result[0].uid ,  JSON.parse(this.tradeToJSON(result[0]))).then(res => {
        this.presentToast("Intercambio marcado como finalizado");
        this.router.navigate(['main']);
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
