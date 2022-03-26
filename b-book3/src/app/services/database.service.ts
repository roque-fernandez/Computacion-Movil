import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Book } from '../shared/book.interface';
import { Trade } from '../shared/trade.interface';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  //FUNCIONES GENERALES PARA CUALQUIER TABLA

  async create(collection, dato) {
    try {
      return await this.firestore.collection(collection).add(dato);
    } catch (error) {
      console.log("error en: create ", error)
    }
  }

  async getAll(collection) {
    try {
      return await this.firestore.collection(collection).valueChanges();
    } catch (error) {
      console.log("error en: getAll ", error)
    }
  }


  async getById(collection, id) {
    try {
      return await this.firestore.collection(collection).doc(id).get();
    } catch (error) {
      console.log("error en: getById ", error)
    }
  }


  async delete(collection, id) {
    try {
      return await this.firestore.collection(collection).doc(id).delete();
    } catch (error) {
      console.log("error en: delete ", error)
    }
  }


  async update(collection, id, dato) {
    try {
      return await this.firestore.collection(collection).doc(id).set(dato);
    } catch (error) {
      console.log("error en: update ", error)
    }
  }

  //FUNCION QUE OBTIENE LOS ELEMENTOS DE UNA COLECCION QUE PERTENECE O NO A UN USUARIO
  async getCollectionByUserId(collection,condition,user_id) {
    try {
      return await this.firestore.collection(collection, ref => ref.where('userId', condition, user_id)).valueChanges();
    } catch (error) {
      console.log("error en: getCollectionById ", error)
    }
  }

  //FUNCION QUE OBTIENE TODOS LOS LIBROS DE UN USUARIO
  async getBooksByUserId(user_id) {
    try {
      return await this.firestore.collection('books', ref => ref.where('userId', '==', user_id)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const libro = a.payload.doc.data() as Book;
          libro.uid = a.payload.doc.id;
          return libro;
        }))
      );
    } catch (error) {
      console.log("error en: getCollectionById ", error)
    }
  }

  //FUNCION QUE OBTIENE LOS LIBROS DE OTROS USUARIOS FILTRANDO POR REGION Y CATEGORIA
  async getOtherUsersBooks(user_id,region,categoria) {
    try {
      return await this.firestore.collection('books', ref => ref.where('userId', '!=', user_id).where('region','==',region).where('category','==',categoria).where('availability','==','Disponible')).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const libro = a.payload.doc.data() as Book;
          libro.uid = a.payload.doc.id;
          return libro;
        }))
      );
    } catch (error) {
      console.log("error en: getCollectionById ", error)
    }
  }

  //FUNCION QUE OBTIENE LOS LIBROS DISPONIBLES DEL USUARIO
  async getUserAvailableBooks(user_id) {
    try {
      return await this.firestore.collection('books', ref => ref.where('userId', '==', user_id).where('availability','==',"Disponible")).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const libro = a.payload.doc.data() as Book;
          libro.uid = a.payload.doc.id;
          return libro;
        }))
      );
    } catch (error) {
      console.log("error en: getCollectionById ", error)
    }
  }

  async getRequests(user_id) {
    try {
      var date = new Date();

      return await this.firestore.collection('trades', ref => ref.where('idUser2', '==', user_id).where('state','==','Pendiente')).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const trade = a.payload.doc.data() as Trade;
          trade.uid = a.payload.doc.id;
          return trade;
        }))
      );
    } catch (error) {
      console.log("error en: getCollectionById ", error)
    }
  }

  //.where('loan_date','>',date)


}