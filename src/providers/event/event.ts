import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventProvider {
  public eventRef:firebase.database.Reference;
  constructor() {
    this.eventRef = firebase.database().ref(`events`);
    // firebase.auth().onAuthStateChanged( user => {
    //   if (user) {
    //     this.eventRef = firebase.database().ref(`userProfile/${user.uid}`);
    //   }
    // });
  }

  getEventList(): firebase.database.Reference {
    //return this.eventRef.child('/eventList');
    return this.eventRef;
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

}
