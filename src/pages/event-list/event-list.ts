import {Component, OnDestroy, OnInit} from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {EventProvider} from "../../providers/event/event";
import {Observable} from "rxjs/Observable";
import {UserLikesProvider} from "../../providers/user-likes/user-likes";
import {BaseClass} from "../BasePage";

@IonicPage({
  name: 'event-list'
})
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage extends BaseClass implements OnInit, OnDestroy{


  public eventsRx: Observable<any[]>;
  private startAtFilter: string;

  constructor(public navCtrl: NavController,
              public eventSvc: EventProvider,
              private userLikeSvc: UserLikesProvider) {
    super();
    var newDate = Date.now() + -60*24*3600*1000; // date n days ago in milliseconds UTC
    this.startAtFilter = new Date(newDate).toISOString();

  }

  onAddLike(eventKey: string){
    this.userLikeSvc.addLike(eventKey);
    //this.reloadEvents();
  }

  onRemoveLike(eventKey: string){
    this.userLikeSvc.removeLike(eventKey);
    //this.reloadEvents();
  }

  ngOnInit(): void {
    this.eventsRx = this.eventSvc.getEvents()
      .takeUntil(this.componentDestroyed$)
      .map((items) => {
      return items.map(item => {
        this.userLikeSvc.isLiked(item.$key)
          .takeUntil(this.componentDestroyed$)
          .map( (ul) =>{
            item.isLiked = ul;
          });
        return item;
      })
    })
  }

  ngOnDestroy(): void {
    console.log('EventListPage::everything works as intended with or without super call');
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

  goToEventAttendees(eventKey) {
    //console.log('goToEventAttendees:' + eventId);
    this.navCtrl.push('event-attendees', { 'eventKey': eventKey });
  }

}
