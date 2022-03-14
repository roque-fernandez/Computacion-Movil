import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  

  constructor(private storage: AngularFireStorage) { }

  uploadPhoto(file: any, path: string, name:string): Promise<String> {
    return new Promise(   resolve => {

      const filePath = path + "/" + name;
      const ref = this.storage.ref(filePath);
      const task = ref.put(file);
      

      
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe( res => {
            const downloadURL = res;
            resolve(downloadURL);
            return;
          }) ;
        }) 
     )
    .subscribe();
    
    });    
  }
}
