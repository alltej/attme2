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
    return this.af.object(`/events/${eventId}`).update({
      when: newDate
    });
  }

  updateEventName(eventId: string | any, newName: string) {
    return this.af.object(`/events/${eventId}`).update({
      name: newName
    });
  }

  updateEventLocation(eventId: string | any, newLocation: any) {
    return this.af.object(`/events/${eventId}`).update({
      where: newLocation
    });
  }

  updateEventDescription(eventId: string | any, newDescription: any) {
    return this.af.object(`/events/${eventId}`).update({
      description: newDescription
    });
  }
}
