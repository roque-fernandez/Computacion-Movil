import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Book } from '../shared/book.interface';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {
  libro: Book = { 
    uid: "abc",
    userId: "QJMW5r2L5MXII7pYYE81HzIToWt2",
    title: "Biblia",
    author: "Jesus",
    description: "Bonito",
    imageURL: null,
    category: null,
    city: "Sevilla",
    availability: "Disponible",
    materialState: "Usado"
  };

  constructor(private database: DatabaseService) { }

  ngOnInit() {
  }

  //funcion que sube un libro a la base de datos
  uploadBook() {
    this.database.create('books', this.libro).then(res => {
      console.log(res);
    }).catch(err => {
      console.log("Error en alta de libro: ", err);
    });
  }

}
