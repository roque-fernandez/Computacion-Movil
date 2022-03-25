import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.page.html',
  styleUrls: ['./my-books.page.scss'],
})
export class MyBooksPage implements OnInit {

  user:User = null;

  misLibros: Book[] = [];

  misLibrosSubscriber: Subscription;

  constructor(
    private database: DatabaseService,
    private router: Router
  ) { 
    this.user = getAuth().currentUser;
    this.getUserBooks();
    this.printBooks();
  }

  ngOnInit() {
  }

  //funcion que obtiene los libros del usuario

  async getUserBooks(){
    this.misLibrosSubscriber = (await this.database.getBooksByUserId(this.user.uid)).subscribe( res => {
      if(res.length){
        this.misLibros = res as Book[];
        this.printBooks();
      }
    });
  }

  //funcion que borra un libro del usuario
  
  async deleteBook(libro){
    await this.database.delete("books",libro.uid).then(res => {
      console.log("Libro borrado con éxito"); 
      this.getUserBooks();     
    }).catch(err => {
      console.log("Error al borrar libro: ", err);
    });
  }

  printBooks(){
    if(!!this.misLibros){
      this.misLibros.forEach((book) => {
        console.log("Titulo: ",book.title, "  || UserId: ", book.userId, "  || BookId: ", book.uid, );
      });
    }
  }

}
