import {Component, OnInit, OnDestroy} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {UserCircleProvider} from "../../providers/user-circle/user-circle";
import {MemberProvider} from "../../providers/member/member";
//import "rxjs/add/operator/debounceTime";
import {AttendanceProvider} from "../../providers/event/attendance";
import {BaseClass} from "../BasePage";
import {EventProvider} from "../../providers/event/event";
import {attmeConfig} from "../../config/attme.config";
import {UserData} from "../../providers/data/user-data";

@IonicPage({
  segment: ':eventId/event-attendees'
})
@Component({
  selector: 'page-event-attendees',
  templateUrl: 'event-attendees.html',
})
export class EventAttendeesPage extends BaseClass implements OnInit, OnDestroy {

  public currentEvent: any = {};
  relationship: any;
  userCircles: any[];
  searchControl: FormControl;
  searchTerm: string = '';
  searching: any = false;
  eventName: string = "";
  private eventId: string;
  private membersRx: Observable<any[]>;
  private members: any[] = [];
  private isAttendanceEnabled: boolean  = false;
  private ooid: string;

  constructor(public navCtrl: NavController,
              private membersSvc: MemberProvider,
              private attendanceSvc: AttendanceProvider,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private userSvc: UserCircleProvider,
              private userData: UserData,
              private  eventSvc: EventProvider) {
    super();


    this.searchControl = new FormControl();
    this.eventId = this.navParams.get('eventId');
    this.ooid = this.userData.getCurrentOOID();
    //console.log(`EventAttendeesPage::constructor::${this.currentEventKey}`);
    //this.eventDate = eventSvc.getEventDetail(this.currentEventKey);

  }

  ngOnInit(): void {
    this.relationship = "circles";
    this.userCircles = this.userSvc.getMyCircles1();
//this.userCircles
//    this.setFilteredItems(this.userCircles);
//this.setFilteredItems(this.userCircles);
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });


    this.eventSvc.getEventDetail(this.ooid, this.eventId).take(1)
      .subscribe( (snapshot)=> {
        if (snapshot.val() == null) return null;
        let eventDate = new Date(snapshot.val().when);
        this.eventName = snapshot.val().name;
        this.isAttendanceEnabled =  this.isEnableAttendance(eventDate);
      })
    //   .then( userProfileValue => {
    //   let eventDate =  userProfileValue.val().when;
    //   this.isPastEvent =  this.isDateBeforeToday(eventDate);
    //
    // })
  }

  // ngOnDestroy(): void {
  //   console.log('a::EventAttendeesPage::everything works as intended with or without super call');
  // }

  onSearchInput(){
    this.searching = true;
  }

  setFilteredItems(){
    this.membersRx =  this.membersSvc.getMembersForEvent(this.ooid, this.eventId)
      .takeUntil(this.componentDestroyed$);
    if (!(this.searchTerm == null || this.searchTerm == '')){
      this.membersRx = this.membersRx.map((members) =>
        members.filter(member => member.lastname.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstname.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1))
    }
    if (this.relationship == "circles"){
      this.membersRx = this.membersRx
        .map((members) =>
          members.filter(member => this.userCircles.indexOf(member.$key) !== -1)
        );
    }

    this.membersRx
      .map(members =>{
        return members.map(member =>{
          this.attendanceSvc.getMemberVoteCount(this.eventId, member.$key)
            .takeUntil(this.componentDestroyed$)
            .map( (ul) =>{
              return ul;
            })//member.voteCount = vote.voteCount;
            .subscribe(ul =>{
              // if (ul.votes != null){
              //   console.log(ul.votes)
              // }
              member.voteCount = ul.voteCount != null ? ul.voteCount : null;
            });
          return member;
        })
        //return members;
      }) //TODO
      .map(members =>{
        return members.map(member =>{
          this.attendanceSvc.isVoted(this.eventId, member.$key)
            .takeUntil(this.componentDestroyed$)
            .map( (ul) =>{
              //console.log(ul)
              return ul;
            })//member.voteCount = vote.voteCount;
            .subscribe(ul =>{
              member.isVoted = ul.on != null ? true : false;
            });
          return member;
        })
        //return members;
      })
      .subscribe((items: any[]) =>{
        this.members = items;
      });
  }


  onUpVote(selectedMember: any){
    //console.log(`${this.currentEventKey}, ${selectedMember.$key}`)
    this.attendanceSvc.addAttendee(this.eventId, selectedMember.$key);
  }

  onDownVote(selectedMember: any){
    this.attendanceSvc.removeAttendee(this.eventId, selectedMember.$key);
  }

  selectedAll(){
    this.relationship = "all";
    this.setFilteredItems();
    this.searching = false;
  }

  selectedCircles(){
    this.relationship = "circles";
    //this.setFilteredItems(this.userCircles);
    this.setFilteredItems();
    this.searching = false;
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }


  getAvatar(photoUrl: String) {
    //console.log(photoUrl);
    if (photoUrl == null) {
      return "assets/images/profile-default.png";
      //return "assets/img/avatar-luke.png"
    }else{
      return photoUrl;
    }
  }


  isEnableAttendance(eventDate) {
    //if (this.isToday(eventDate)) return true;
    if (this.isAttendanceEnabledForEvent(eventDate)) return true;
    return false;
  }

  isToday(otherDate){
    let today = new Date();
    return (today.toDateString() == otherDate.toDateString());
  }

  isAttendanceEnabledForEvent(eventDate){
    //const NUM_DAYS_TO_ALLOW_ATTENDANCE: number = 2;
    let today = new Date();
    let nDaysAgo = new Date();
    nDaysAgo.setDate(nDaysAgo.getDate() - attmeConfig.numDaysAfterEventAttendanceEnabled);
    //return (d.toDateString() == otherDate.toDateString());
    return (nDaysAgo < eventDate) && (eventDate <= today);
  }

}
