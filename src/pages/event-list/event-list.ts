import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {EventProvider} from "../../providers/event/event";
import {Observable} from "rxjs/Observable";
import {UserLikesProvider} from "../../providers/user-likes/user-likes";

@IonicPage({
  name: 'event-list'
})
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage implements OnInit {
  public eventsRx: Observable<any[]>;
  private startAtFilter: string;

  constructor(public navCtrl: NavController,
              public eventSvc: EventProvider,
              private userLikeSvc: UserLikesProvider) {
    var newDate = Date.now() + -60*24*3600*1000; // date n days ago in milliseconds UTC
    this.startAtFilter = new Date(newDate).toISOString();

  }

  onAddLike(eventKey: string){

    this.userLikeSvc.addLike(eventKey);
  }

  onRemoveLike(eventKey: string){
    this.userLikeSvc.removeLike(eventKey);
  }

  ngOnInit(): void {
    this.eventsRx = this.eventSvc.getEvents().map((items) => {
      return items.map(item => {
             this.userLikeSvc.isLiked(item.$key).subscribe(data => {
                if(data.val()==null) {
                  item.isLiked = false;
                } else {
                  item.isLiked = true;
                }
              });
            return item;
          })
      })
  }

  onNewEvent(){
    this.navCtrl.push('event-create', {'parentPage': this});
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EventListPage');
  }

  goToEventDetail(eventId){
    this.navCtrl.push('event-detail', { 'eventId': eventId });
  }

  goToEventAttendees(eventId) {
    //console.log('goToEventAttendees:' + eventId);
    this.navCtrl.push('event-attendees', { 'eventId': eventId });
  }

}
