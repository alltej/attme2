import {Component, OnDestroy, OnInit} from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import {FormControl} from "@angular/forms";
import {EventProvider} from "../../providers/event/event";
//import {Observable} from "rxjs/Observable";
import {UserLikesProvider} from "../../providers/user-likes/user-likes";
import {BaseClass} from "../BasePage";
import {Observable} from "rxjs/Observable";
import {EventCommentsPage} from "../event-comments/event-comments";

@IonicPage()
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage extends BaseClass implements OnInit, OnDestroy{

  //public eventsRx: Observable<any[]>;
  private events: any[] = [];
  private startAtFilter: string;
  searchControl: FormControl;
  searchTerm: string = '';
  searching: any = false;
  relationship: any;
  constructor(public navCtrl: NavController,
              public eventSvc: EventProvider,
              private userLikeSvc: UserLikesProvider) {
    super();
    this.searchControl = new FormControl();
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
    this.relationship = "current";
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });


  }

  private setFilteredItems() {
    // console.log(this.relationship)
    // console.log("hello")
    let selectedEvents: Observable<any[]>; //= this.eventSvc.getEvents();
    if (this.relationship == "past"){
      selectedEvents = this.eventSvc.getPastEvents();
    }else{
      selectedEvents = this.eventSvc.getRecentEvents();
    }

    if (!(this.searchTerm == null || this.searchTerm == '')){
      //console.log(`search term::${this.searchTerm}`)
      selectedEvents = selectedEvents.map((events) =>
        events.filter(event => event.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || event.description.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1))
    }

    selectedEvents
      .takeUntil(this.componentDestroyed$)
      .map((items) => {
        return items.map(item => {
          this.userLikeSvc.isLiked(item.$key)
            .takeUntil(this.componentDestroyed$)
            .map((ul) => {
              return ul;
            })
            .subscribe(ul => {
              if (ul.on != null) {
                //console.log('likeIt:true')
                item.isLiked = true;
              }
              else {
                //console.log('likeIt:false')
                item.isLiked = false;
              }
            });
          return item;
        })
      })
      .subscribe((items: any[]) => {
        //this.events = items.reverse();
        if (this.relationship == "past"){
          this.events = items.reverse();
        }else{
          this.events = items;
        }
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
    this.navCtrl.push('event-attendees', { 'eventId': eventId });
  }

  onSearchInput(){
    this.searching = true;
  }

  selectPastEvents() {
    this.relationship = "past";
    this.setFilteredItems();
  }

  selectCurrentEvents() {
    this.relationship = "current";
    this.setFilteredItems();
  }

  goToEventComments(eventId: string) {
    //console.log(eventId);
    this.navCtrl.push('event-comments', {
      'eventId': eventId
    });
  }
}
