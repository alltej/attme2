import { Injectable } from '@angular/core';


import * as firebase from 'firebase';

@Injectable()
export class DataProvider {
  eventsRef: any = firebase.database().ref('events');
  membersRef: any = firebase.database().ref('members');

  databaseRef: any = firebase.database();
  connectionRef: any = firebase.database().ref('.info/connected');

  connected: boolean = false;

  constructor() {
    try {
      this.checkFirebaseConnection();

    } catch (error) {
      console.log('Data Service error:' + error);
    }
  }

  checkFirebaseConnection() {
    try {
      //var self = this;
      let connectedRef = this.getConnectionRef();
      connectedRef.on('value', snap => {
        //console.log(snap.val());
        if (snap.val() === true) {
          //console.log('Firebase: Connected:');
          this.connected = true;
        } else {
          //console.log('Firebase: No connection:');
          this.connected = false;
        }
      });
    } catch (error) {
      this.connected = false;
    }
  }

  isFirebaseConnected() {
    return this.connected;
  }

  getDatabaseRef() {
    return this.databaseRef;
  }

  getConnectionRef() {
    return this.connectionRef;
  }

  goOffline() {
    firebase.database().goOffline();
  }

  goOnline() {
    firebase.database().goOnline();
  }

  //
  // loadEvents() {
  //   return this.eventsRef.once('value');
  // }

  getEventsRef() {
    return this.eventsRef;
  }

  getMembersRef() {
    return this.membersRef;
  }
}
