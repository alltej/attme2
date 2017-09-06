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

  //public eventsRx: Observable<any[]>;
  private events: any[] = [];
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
    //console.log('EventList:ngOnInit')
    this.eventSvc.getEvents()
      .takeUntil(this.componentDestroyed$)
      .map((items) => {
      return items.map(item => {
        this.userLikeSvc.isLiked(item.$key)
          .takeUntil(this.componentDestroyed$)
          .map( (ul) =>{
            return ul;
          })
          .subscribe(ul =>{
            if (ul.on != null) {
              item.isLiked = true;
            }
            else{
              //console.log('likeIt:false')
              item.isLiked = false;
            }
          });
        return item;
      })
    })
      .subscribe((items: any[]) =>{
        this.events = items;
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

  goToEventAttendees(eventKey) {
    //console.log('goToEventAttendees:' + eventId);
    this.navCtrl.push('event-attendees', { 'eventKey': eventKey });
  }

}
