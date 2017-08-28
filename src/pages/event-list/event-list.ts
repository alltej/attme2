import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventProvider} from "../../providers/event/event";
//import {Observable} from "rxjs/Observable";
import {Observable} from 'rxjs/Rx';
@IonicPage({
  name: 'event-list'
})
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage implements OnInit {
  public eventList: Array<any>;
  private startAtFilter: string;
  //events: Array<any[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventProvider: EventProvider) {
    var newDate = Date.now() + -60*24*3600*1000; // date n days ago in milliseconds UTC
    this.startAtFilter = new Date(newDate).toISOString();
  }
  events: Observable<any[]>;
  // ngOnInit(): void {
  //   this.eventProvider.getEventList().orderByChild('when').startAt(this.startAtFilter).on('value', snapshot => {
  //     this.eventList = [];
  //     snapshot.forEach( snap => {
  //       this.eventList.push({
  //         id: snap.key,
  //         name: snap.val().name,
  //         description: snap.val().description,
  //         when: snap.val().when,
  //         where: snap.val().where,
  //       });
  //       return false
  //     });
  //   });
  // }


  ngOnInit(): void {
    console.log('EventListPage::ngOnInit');
    // this.events = this.eventProvider.getEvents2()
    //   .map( (arr) => { return arr.reverse(); } );

      this.eventProvider.getEventList().orderByChild('when').startAt(this.startAtFilter).on('value', snapshot => {
        this.eventList = [];
        snapshot.forEach( snap => {
          this.eventList.push({
            id: snap.key,
            name: snap.val().name,
            description: snap.val().description,
            when: snap.val().when,
            where: snap.val().where,
            attendeeCount: snap.val().attendeeCount
          });
          return false
        });
      });
  }
  //
  // ionViewDidEnter() {
  //
  //   this.eventProvider.getEventList().orderByChild('when').startAt(this.startAtFilter).on('value', snapshot => {
  //     this.eventList = [];
  //     snapshot.forEach( snap => {
  //       this.eventList.push({
  //         id: snap.key,
  //         name: snap.val().name,
  //         description: snap.val().description,
  //         when: snap.val().when,
  //         where: snap.val().where,
  //       });
  //       return false
  //     });
  //   });
  // }

  onNewEvent(){
    this.navCtrl.push('event-create', {'parentPage': this});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventListPage');
  }

  goToEventDetail(eventId){
    this.navCtrl.push('event-detail', { 'eventId': eventId });
  }

  goToEventAttendees(eventId) {
    console.log('goToEventAttendees:' + eventId);
    this.navCtrl.push('event-attendees', { 'eventId': eventId });
  }

  getAttendanceCount(eventId: string): number{
    console.log(`getAttendanceCount: ${eventId}`);
    return this.eventProvider.getAttendanceCount(eventId);
  }
}
