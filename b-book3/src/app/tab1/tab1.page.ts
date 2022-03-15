import { Component } from '@angular/core';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  user:User = null;

  constructor() {

    this.user = getAuth().currentUser;
    console.log("User en profile->",this.user);
    console.log("Existe nombre ->",!!this.user.displayName);
  }

}
