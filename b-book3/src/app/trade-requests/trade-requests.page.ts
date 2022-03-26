import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { Trade } from '../shared/trade.interface';
import { Request } from '../shared/request.interface';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trade-requests',
  templateUrl: './trade-requests.page.html',
  styleUrls: ['./trade-requests.page.scss'],
})
export class TradeRequestsPage implements OnInit {

  user:User = null;

  requests: Request[] = [];

  trades: Trade[] = [];

  requestSubscriber: Subscription;

  constructor(
    private database: DatabaseService,
    private router: Router
  ) { 
    this.user = getAuth().currentUser;
    this.getRequests();
    console.log(this.trades);
  }

  ngOnInit() {
  }

  async getRequests(){
    this.requestSubscriber = (await this.database.getRequests(this.user.uid)).subscribe( res => {
      if(res.length){
        this.trades = res as Trade[];
        console.log("Se han obtenido las solicitudes de intercambio: ",this.trades);
      }
    });
  }

}
