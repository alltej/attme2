import { Injectable } from '@angular/core';


import * as firebase from 'firebase';

@Injectable()
export class DataProvider {
  //eventsRef: any = firebase.database().ref('events');
  //membersRef: any = firebase.database().ref('members');
  orgsRef: any = firebase.database().ref('organizations');

  usersRef: any = firebase.database().ref('users');
  userInvitesRef: any = firebase.database().ref('userInvites');
  invitesRef: any = firebase.database().ref('invites');

  databaseRef: any = firebase.database();
  connectionRef: any = firebase.database().ref('.info/connected');

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

  getUser(userUid: string) {
    return this.usersRef.child(userUid).once('value');
  }

  getUserRef(userUid: string) {
    return this.usersRef.child(userUid);
  }

  // getMemberData(memberKey: any) {
  //   return this.membersRef.child(memberKey).once('value');
  // }

  // getUserThreads(userUid: string) {
  //   return this.threadsRef.orderByChild('user/uid').equalTo(userUid).once('value');
  // }

  getUserOrgs(userUid: string) {
    //console.log(`getUserOrgs:${userUid}`)
    return this.usersRef.child(userUid + '/organizations').once('value');
  }

  getUserInvite(userId: string) {
    //console.log(`getUserOrgs:${userUid}`)
    //
    return this.userInvitesRef.child(`/${userId}`).once('value');
  }

  getEvent(ooid: string, eventId: string) {
    return this.getEventsRef(ooid)
      .child(`${eventId}`).once('value');
  }

  getEventsRef(ooid: string) {
    return this.getOrgsRef()
      .child(`${ooid}/events`)
  }

  getMembersRef(ooid: string) {
    //console.log(`data::getMembersRef::ooid=${ooid}`)
    return this.getOrgsRef()
      .child(`${ooid}/members`)
  }

  getEventCommentsRef(ooid: string, eventId: string) {
    return this.getOrgsRef()
      .child(`${ooid}/comments/${eventId}`)
  }

  getOrgsRef() {
    return this.orgsRef;
  }

  getInvitesRef() {
    return this.invitesRef;
  }

  getOrgsRefByOOId(ooid: string) {
    return this.orgsRef.child(ooid);
  }
}
