import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, doc, setDoc } from "firebase/firestore";
import { User } from '../shared/user.interface';


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


}