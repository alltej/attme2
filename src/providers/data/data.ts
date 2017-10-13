import { Injectable } from '@angular/core';


import * as firebase from 'firebase';

@Injectable()
export class DataProvider {
  eventsRef: any = firebase.database().ref('events');
  membersRef: any = firebase.database().ref('members');
  orgsRef: any = firebase.database().ref('organizations');

  usersRef: any = firebase.database().ref('users');

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
          console.log('Firebase: Connected:');
          this.connected = true;
        } else {
          console.log('Firebase: No connection:');
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

  getUser(userUid: string) {
    return this.usersRef.child(userUid).once('value');
  }

  // getMemberData(memberKey: any) {
  //   return this.membersRef.child(memberKey).once('value');
  // }

  // getUserThreads(userUid: string) {
  //   return this.threadsRef.orderByChild('user/uid').equalTo(userUid).once('value');
  // }

  getUserOrgs(userUid: string) {
    console.log(`getUserOrgs:${userUid}`)
    //
    return this.usersRef.child(userUid + '/organizations').once('value');
  }

  getEventsRef() {
    return this.eventsRef;
  }

  getMembersRef() {
    return this.membersRef;
  }

  getOrgsRef() {
    return this.orgsRef;
  }
}
