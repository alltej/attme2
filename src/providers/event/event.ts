import {Injectable, OnDestroy} from '@angular/core';
import firebase from 'firebase';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {attmeConfig} from "../../config/attme.config";
import {IEvent, INewEvent} from "../../models/event.interface";
import {DataProvider} from "../data/data";
import {UserData} from "../data/user-data";

@Injectable()
export class EventProvider {

  private startAtFilter: string;
  private endAtFilter: string;

  constructor(private af:AngularFireDatabase,
              private dataSvc: DataProvider,
              private userData: UserData) {

  }

  getRecentEvents(): FirebaseListObservable<any[]> {
    let currentDate = Date.now() + -attmeConfig.recentPreviousNumDays*24*3600*1000; // date n days ago in milliseconds UTC;
    let futureDateMax = Date.now() + +60*24*3600*1000; // date n days ago in milliseconds UTC
    this.startAtFilter = new Date(currentDate).toISOString();
    this.endAtFilter = new Date(futureDateMax).toISOString();
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
    return this.af.list(`/organizations/${this.userData.currentOOId}/events/${eventId}/likedBy`,{
      query: {
        orderByKey: true,
        limitToLast: 20
      }
    });
  }

  getEventDetail(eventId:string) {
    return this.af.object(`/organizations/${this.userData.currentOOId}/events/${eventId}`, { preserveSnapshot: true })
  }


  createEvent(name:string,
              description:string,
              when:string,
              where:string): firebase.Promise<any> {
    //console.log(description)
    return this.af.list(`/events`).push({
      name: name,
      description: description,
      when: when,
      where: where
    });
  }

  updateEventDate(eventId: string, newDate: Date) {
    return this.dataSvc.getEventsRef(this.userData.currentOOId)
      .child(eventId)
      .update({
        when: newDate
      });
  }

  updateEventName(eventId: string | any, newName: string) {
    return this.dataSvc.getEventsRef(this.userData.currentOOId)
      .child(eventId)
      .update({
        name: newName
      });
  }

  updateEventLocation(eventId: string | any, newLocation: any) {
    return this.dataSvc.getEventsRef(this.userData.currentOOId)
      .child(eventId)
      .update({
        where: newLocation
      });
  }

  updateEventDescription(eventId: string | any, newDescription: any) {
    return this.dataSvc.getEventsRef(this.userData.currentOOId)
      .child(eventId)
      .update({
        description: newDescription
      });
  }

  createEvent2(ooid: string, newEvent: INewEvent): firebase.Promise<any> {
      try {
        this.dataSvc.getOrgsRef().child(`${ooid}/events`).child(newEvent.key).set(newEvent);

        return this.dataSvc.getOrgsRef().child(`${ooid}/stats/events`).once('value')
          .then((snapshot) => {
            let count = snapshot == null ? 0 : snapshot.val();
            this.dataSvc.getOrgsRef().child(`${ooid}/stats/events`).set(count + 1);
          });
      } catch (e) {
        //console.log(e)
      }
  }

  // createMember3(ooid: string, newMember: INewMember): firebase.Promise<any> {
  //   try {
  //     this.orgRef.child(`${ooid}/members`).child(newMember.memberKey).set(newMember);
  //
  //     return this.orgRef.child(`${ooid}/stats/members`).once('value')
  //       .then((snapshot) => {
  //         let count = snapshot == null ? 0 : snapshot.val();
  //         this.orgRef.child(`${ooid}/stats/members`).set(count + 1);
  //       });
  //   } catch (e) {
  //     //console.log(e)
  //   }
  // }
}
