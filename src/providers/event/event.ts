import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {AuthProvider} from "../auth/auth";

@Injectable()
export class EventProvider {
  public eventRef:firebase.database.Reference;
  public eventList: Array<any>;
  private startAtFilter: string;
  private userId: string;

  constructor(private af:AngularFireDatabase,
              private authSvc:AuthProvider) {
    this.eventRef = firebase.database().ref(`events`);
    //this.userId = this.authService.getActiveUser().uid;
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

  addLike(eventKey: string) {
    let url = `/eventLikes/${eventKey}/likes/${this.authSvc.getActiveUser().uid}`;
    this.af.object(url).$ref.transaction(currentValue => {
      if (currentValue === null) {
        return{on : new Date().toISOString()};
      }
    })
      .then( result => {
        if (result.committed) {
          let voteUrl = `/eventLikes/${eventKey}/count`;
          let tagObs = this.af.object(voteUrl);
          tagObs.$ref.transaction(tagValue => {
            return tagValue ? tagValue + 1 : 1;
          });
        }
      })
      .catch( error => {
        // handle error
      });
  }

  removeLike(eventKey: string) {
    let countUrl = `/eventLikes/${eventKey}/count`;
    let likeCountRef = this.af.object(countUrl);
    let likeCount = 0;
    likeCountRef.$ref.transaction(tagValue => {
      likeCount = tagValue ? tagValue - 1 : 0;
      return likeCount;
    }).then(result => {
      if (result.committed) {
        if (likeCount == 0){
          let url = `/eventLikes/${eventKey}/likes/${this.authSvc.getActiveUser().uid}`;
          this.af.object(url).remove();
        }
      }
    });
  }

  isLiked(eventKey: string) {
    let url = `/eventLikes/${eventKey}/likes/${this.authSvc.getActiveUser().uid}`;
    let liked = false;
    const likedRef = this.af.object(url, { preserveSnapshot: true });

    likedRef.subscribe(data => {
      if(data.val()==null) {
        liked = false;
      } else {
        liked = true;
      }
    });
    return liked;
  }

  getLikeCount(eventKey: string) {
    let voteCount = 0;
    let voteUrl = `/eventLikes/${eventKey}/count`;
    var voteCountRef = this.af.object(voteUrl,{ preserveSnapshot: true})

    voteCountRef.subscribe(snapshot => {
      voteCount = snapshot.val();
    });
    return voteCount;
  }
}
