import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';


@Injectable()
export class StorageProvider {

  storageRef: any = firebase.storage().ref();
  constructor() {}


  getStorageRef() {
    return this.storageRef;
  }


}
