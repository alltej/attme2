import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventProvider} from "../../providers/event/event";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";

@IonicPage({
  name: 'event-attendees',
  segment: 'event-attendees/:eventId'
})
@Component({
  selector: 'page-event-attendees',
  templateUrl: 'event-attendees.html',
})
export class EventAttendeesPage {

  public currentEvent: any = {};

  members: Observable<any[]>;
  //eventGroup: {event: Event, attendees: Attendee[], icon: string};
  relationship: any;
  userCircles: any[];

  searchControl: FormControl;
  searchTerm: string = '';
  searching: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public eventProvider: EventProvider) {
    this.searchControl = new FormControl();

  }

  ionViewDidEnter(){
    this.eventProvider.getEventDetail(this.navParams.get('eventId'))
      .on('value', eventSnapshot => {
        this.currentEvent = eventSnapshot.val();
        this.currentEvent.id = eventSnapshot.key;
      });
  }

  onSearchInput() {

  }

  selectedAll() {

  }

  selectedCircles() {

  }

  onDownVote(member) {

  }

  onUpVote(member) {

  }

  isVoted(member) {

  }

  getVoteCount(member) {

  }
}
