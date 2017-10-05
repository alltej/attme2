import { Injectable } from '@angular/core';


import * as firebase from 'firebase';

@Injectable()
export class DataProvider {
  databaseRef: any = firebase.database();
  connectionRef: any = firebase.database().ref('.info/connected');
  eventsRef: any = firebase.database().ref('events');
  statisticsRef: any = firebase.database().ref('statistics');
  connected: boolean = false;

  constructor() {
    try {
      this.checkFirebaseConnection();

    } catch (error) {
      //console.log('Data Service error:' + error);
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

  getStatisticsRef() {
    return this.statisticsRef;
  }

  getTotalThreads() {
    return this.statisticsRef.child('events').once('value');
  }

  getEventsRef() {
    return this.eventsRef;
  }

  loadEvents() {
    return this.eventsRef.once('value');
  }
}
