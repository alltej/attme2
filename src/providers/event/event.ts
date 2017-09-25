import {Injectable, OnDestroy} from '@angular/core';
import firebase from 'firebase';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {attmeConfig} from "../../config/attme.config";

@Injectable()
export class EventProvider implements OnDestroy {
  ngOnDestroy(): void {
  }

  public eventRef:firebase.database.Reference;
  private startAtFilter: string;
  private endAtFilter: string;

  constructor(private af:AngularFireDatabase) {
    //this.eventRef = firebase.database().ref(`events`);
    let pastDateMin = Date.now() + -60*24*3600*1000; // date n days ago in milliseconds UTC
    let currentDate = Date.now() + -2*24*3600*1000; // date n days ago in milliseconds UTC;
    let futureDateMax = Date.now() + +60*24*3600*1000; // date n days ago in milliseconds UTC
    //this.startAtFilter = new Date(newDate).toISOString();
    //d.setDate(d.getDate() - NUM_DAYS_TO_ALLOW_ATTENDANCE);
    this.startAtFilter = new Date(currentDate).toISOString();
    this.endAtFilter = new Date(futureDateMax).toISOString();

  }

  getRecentEvents(): FirebaseListObservable<any[]> {
     return this.af.list('/events',{
      query: {
        orderByChild: 'when',
        startAt: this.startAtFilter,
        endAt: this.endAtFilter,
      }
    });
  }

  getPastEvents(): FirebaseListObservable<any[]> {
    let pastDateMin = Date.now() + -60*24*3600*1000; // date n days ago in milliseconds UTC
    let currentDate = Date.now()+ -attmeConfig.recentPreviousNumDays*24*3600*1000; // date n days ago in milliseconds UTC
     return this.af.list('/events',{
      query: {
        orderByChild: 'when',
        startAt: new Date(pastDateMin).toISOString(),
        endAt: new Date(currentDate).toISOString(),
      }
    });
  }

  getEventLikes(eventId: string) {
    return this.af.list(`/events/${eventId}/likedBy`,{
      query: {
        orderByKey: true,
        limitToLast: 20
      }
    });
  }

  getEventDetail(eventId:string) {
    return this.af.object(`/events/${eventId}`, { preserveSnapshot: true });
  }

  // createEvent(eventName:string,
  //             eventDescription:string,
  //             eventDate:string,
  //             eventLocation:string): firebase.Promise<any> {
  //   return this.eventRef.push({
  //     name: eventName,
  //     description: eventDescription,
  //     when: eventDate,
  //     where: eventLocation
  //   });
  // }
  createEvent(eventName:string,
              eventDescription:string,
              eventDate:string,
              eventLocation:string): firebase.Promise<any> {
    return this.af.list(`/events`).push({
      name: eventName,
      description: eventDescription,
      when: eventDate,
      where: eventLocation
    });
  }

  //
  // isLiked(eventKey: string) {
  //   let url = `/eventLikes/${eventKey}/likes/${this.authSvc.getActiveUser().uid}`;
  //   let liked = false;
  //   const likedRef = this.af.object(url, { preserveSnapshot: true });
  //
  //   likedRef.subscribe(data => {
  //     if(data.val()==null) {
  //       liked = false;
  //     } else {
  //       liked = true;
  //     }
  //   });
  //   return liked;
  // }

  // getLikeCount(eventKey: string) {
  //   let voteCount = 0;
  //   let voteUrl = `/eventLikes/${eventKey}/count`;
  //   var voteCountRef = this.af.object(voteUrl,{ preserveSnapshot: true})
  //
  //   voteCountRef.subscribe(snapshot => {
  //     voteCount = snapshot.val();
  //   });
  //   return voteCount;
  // }
  //
  // getEvents2() : FirebaseListObservable<any[]> {
  //   return this.af.list('/events', {
  //     query: {
  //       limitToLast: 20,
  //       orderByChild: 'when',
  //       startAt: this.startAtFilter,
  //     }})
  // }
  //
  // addLike(eventKey: string) {
  //   let url = `/eventLikes/${eventKey}/likes/${this.authSvc.getActiveUser().uid}`;
  //   this.af.object(url).$ref.transaction(currentValue => {
  //     if (currentValue === null) {
  //       return{on : new Date().toISOString()};
  //     }
  //   })
  //     .then( result => {
  //       if (result.committed) {
  //         let voteUrl = `/eventLikes/${eventKey}/count`;
  //         let tagObs = this.af.object(voteUrl);
  //         tagObs.$ref.transaction(tagValue => {
  //           return tagValue ? tagValue + 1 : 1;
  //         });
  //       }
  //     })
  //     .catch( error => {
  //       // handle error
  //     });
  // }
  //
  // removeLike(eventKey: string) {
  //   let countUrl = `/eventLikes/${eventKey}/count`;
  //   let likeCountRef = this.af.object(countUrl);
  //   let likeCount = 0;
  //   likeCountRef.$ref.transaction(tagValue => {
  //     likeCount = tagValue ? tagValue - 1 : 0;
  //     return likeCount;
  //   }).then(result => {
  //     if (result.committed) {
  //       if (likeCount == 0){
  //         let url = `/eventLikes/${eventKey}/likes/${this.authSvc.getActiveUser().uid}`;
  //         this.af.object(url).remove();
  //       }
  //     }
  //   });
  // }

}
