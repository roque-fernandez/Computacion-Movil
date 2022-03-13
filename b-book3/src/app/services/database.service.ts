import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
      return await this.firestore.collection(collection).snapshotChanges();
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
      console.log("error en: getAll ", error)
    }
  }


  async update(collection, id, dato) {
    try {
      return await this.firestore.collection(collection).doc(id).set(dato);
    } catch (error) {
      console.log("error en: getAll ", error)
    }
  }


}