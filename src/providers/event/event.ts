import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";

@Injectable()
export class EventProvider {
  public eventRef:firebase.database.Reference;
  public eventList: Array<any>;
  private startAtFilter: string;
  constructor(private af:AngularFireDatabase) {
    this.eventRef = firebase.database().ref(`events`);
    // firebase.auth().onAuthStateChanged( user => {
    //   if (user) {
    //     this.eventRef = firebase.database().ref(`userProfile/${user.uid}`);
    //   }
    // });
    var newDate = Date.now() + -60*24*3600*1000; // date n days ago in milliseconds UTC
    this.startAtFilter = new Date(newDate).toISOString();
  }

  getEventList(): firebase.database.Reference {
    return this.eventRef;
  }

  //TODO
  getEventList2() {
    this.eventRef.orderByChild('when').startAt(this.startAtFilter).on('value', snapshot => {
      this.eventList = [];
      snapshot.forEach( snap => {
        this.eventList.push({
          id: snap.key,
          name: snap.val().name,
          description: snap.val().description,
          when: snap.val().when,
          where: snap.val().where,
        });
        return false
      });
    });
  }

  getEventDetail(eventId:string): firebase.database.Reference {
    return this.eventRef.child(eventId);
  }

  createEvent(eventName:string,
              eventDescription:string,
              eventDate:string,
              eventLocation:string): firebase.Promise<any> {
    return this.eventRef.push({
      name: eventName,
      description: eventDescription,
      when: eventDate,
      where: eventLocation
    });
  }

  //
  // addGuest(guestName, eventId, eventPrice, guestPicture = null): firebase.Promise<any> {
  //   return this.eventRef.child('/eventList').child(eventId)
  //     .child('guestList').push({
  //       guestName: guestName
  //     })
  //     .then((newGuest) => {
  //       this.userProfileRef.child('/eventList').child(eventId).transaction( event => {
  //         event.revenue += eventPrice;
  //         return event;
  //       });
  //       if (guestPicture != null) {
  //         firebase.storage().ref('/guestProfile/').child(newGuest.key)
  //           .child('profilePicture.png').putString(guestPicture, 'base64', {contentType: 'image/png'})
  //           .then((savedPicture) => {
  //             this.userProfileRef.child('/eventList').child(eventId).child('guestList')
  //               .child(newGuest.key).child('profilePicture').set(savedPicture.downloadURL);
  //           });
  //       }
  //     });
  // }

  getAttendanceCount(eventId: string) : number{
    let childCount = 0;
    let attendeesUrl = `/attendees/${eventId}`;
    const lists = this.af.object(attendeesUrl, { preserveSnapshot: true });
    lists.subscribe(snapshot => {
      childCount = snapshot.numChildren();
    });
    return childCount;
  }

  getEvents2() : FirebaseListObservable<any[]> {
    return this.af.list('/events', {
      query: {
        limitToLast: 20,
        orderByChild: 'when',
        startAt: this.startAtFilter,
      }})
  }
}
