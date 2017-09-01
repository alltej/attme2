import {Component, OnInit, OnDestroy} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {UserCircleProvider} from "../../providers/user-circle/user-circle";
import {MemberProvider} from "../../providers/member/member";
//import "rxjs/add/operator/debounceTime";
import {AttendanceProvider} from "../../providers/event/attendance";
import {BaseClass} from "../BasePage";

@IonicPage({
  name: 'event-attendees',
  segment: ':eventKey/event-attendees'
})
@Component({
  selector: 'page-event-attendees',
  templateUrl: 'event-attendees.html',
})
export class EventAttendeesPage extends BaseClass implements OnInit, OnDestroy {

  public currentEvent: any = {};

  public members: Observable<any[]>;
  // public eventsRx: Observable<any[]>;
  relationship: any;
  userCircles: any[];
//userCircles: any[];
  //let circleKeys = [];
  searchControl: FormControl;
  searchTerm: string = '';
  searching: any = false;
  private currentEventKey: string;

  constructor(public navCtrl: NavController,
              private membersSvc: MemberProvider,
              private attendanceSvc: AttendanceProvider,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private userSvc: UserCircleProvider) {
    super();


    this.searchControl = new FormControl();
    this.currentEventKey = this.navParams.get('eventKey');
    //console.log(`EventAttendeesPage::constructor::${this.currentEventKey}`);
  }



  ngOnDestroy(): void {
    //this.membersSvc.eventAttendeeVoteCount.unsubscribe();
    console.log('EventAttendeesPage::everything works as intended with or without super call');
    //console.log('EventAttendeesPage::everything works as intended with or without super call');
  }

  // ionViewDidLoad() {
  //   this.setFilteredItems();
  //
  //   this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
  //     this.searching = false;
  //     this.setFilteredItems();
  //   });
  // }


  onSearchInput(){
    this.searching = true;
  }

  // ngOnInit(): void {
  //   this.eventsRx = this.eventSvc.getEvents()
  //     .takeUntil(this.componentDestroyed$)
  //     .map((items) => {
  //       return items.map(item => {
  //         this.userLikeSvc.isLiked(item.$key)
  //           .takeUntil(this.componentDestroyed$)
  //           .map( (ul) =>{
  //             item.isLiked = ul;
  //           });
  //         return item;
  //       })
  //     })
  // }

  setFilteredItems(){
    if (this.searchTerm == null || this.searchTerm == ''){
      this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
        .takeUntil(this.componentDestroyed$);
    }else{
      this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
        .takeUntil(this.componentDestroyed$)
        .map((members) =>
          members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
    }

  }

  setFilteredItems0(){
    if (this.searchTerm == null || this.searchTerm == ''){
      this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
        .takeUntil(this.componentDestroyed$)
        .map((items) => {
          return items.map( item => {
            this.attendanceSvc.getUpVotes1(this.currentEventKey, item.$key)
              .takeUntil(this.componentDestroyed$)
              .map( (ul) =>{
                item.tests = ul;
              });
            return item;
          })
      })
    }else{
      this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
        .takeUntil(this.componentDestroyed$)
        .map((members) =>
          members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
    }

  }

  onUpVote(selectedMember: any){
    //console.log(`${this.currentEventKey}, ${selectedMember.$key}`)
    this.attendanceSvc.addAttendee(this.currentEventKey, selectedMember.$key);
  }

  onDownVote(selectedMember: any){
    this.attendanceSvc.removeAttendee(this.currentEventKey, selectedMember.$key);
  }

  isVoted(selectedMember: any){
    return this.attendanceSvc.isVoted(this.currentEventKey, selectedMember.$key);
  }

  selectedAll(){
    this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
      .map((members) => {return members});
  }

  ngOnInit(): void {
    //console.log('EventAttendeesPage::ngOnInit')

    this.userCircles = this.userSvc.getMyCircles1();

    this.setFilteredItems();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  selectedCircles(){
    this.searching = false;
    this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
      .takeUntil(this.componentDestroyed$)
      .map((members) =>
        members.filter(member => this.userCircles.indexOf(member.$key) !== -1)
      );

    if (this.searchTerm == null || this.searchTerm == ''){
      //console.log('setFilteredItems: aa');
    }else{
      this.members = this.members
        .map((members) =>
          members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
    }

  }

  //!!!NOTE: somehow subscribing to an Observable here triggers the call infinitely in the *.html page
  // The work around is to subscribe in the provider and get the snapshot right there.
  getVoteCount(selectedMember: any){
    console.log(selectedMember.$key)
    let c = this.attendanceSvc.getUpVotes(this.currentEventKey, selectedMember.$key);
    return c;
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
