import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {EventProvider} from "../../providers/event/event";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Attendee} from "../../models/attendee.interface";
import {Event} from "../../models/event.interface";
import {AuthProvider} from "../../providers/auth/auth";
import {UserCircleProvider} from "../../providers/user-circle/user-circle";
import {MemberProvider} from "../../providers/member/member";
import "rxjs/add/operator/debounceTime";
import {AttendanceProvider} from "../../providers/event/attendance";

@IonicPage({
  name: 'event-attendees',
  segment: ':eventId/event-attendees'
})
@Component({
  selector: 'page-event-attendees',
  templateUrl: 'event-attendees.html',
})
export class EventAttendeesPage  implements OnInit {

  public currentEvent: any = {};

  members: Observable<any[]>;
  //eventGroup: {event: Event, attendees: Attendee[], icon: string};
  relationship: any;
  userCircles: any[];

  searchControl: FormControl;
  searchTerm: string = '';
  searching: any = false;
  private currentEventId: string;

  constructor(public navCtrl: NavController,
              private membersSvc: MemberProvider,
              private attendanceSvc: AttendanceProvider,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private userSvc: UserCircleProvider) {

    console.log('EventAttendeesPage::constructor')
    this.searchControl = new FormControl();
    this.currentEventId = this.navParams.get('eventId');
  }

  ngOnInit(): void {
    //console.log('EventAttendeesPage')
    //this.eventGroup = { event: this.navParams.data, attendees : [], icon : "brush"};
    //this.eventGroup.event.id = this.navParams.data.$key;

    this.userCircles = this.userSvc.getMyCircles();
  }

  ionViewDidLoad() {
    this.setFilteredItems();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }


  onSearchInput(){
    this.searching = true;
  }

  setFilteredItems(){
    if (this.searchTerm == null || this.searchTerm == ''){
      //console.log('setFilteredItems: aa');
      this.members = this.membersSvc.getMembers()
        .map((members) => {return members});
    }else{
      //return items.filter(item => item.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);
      this.members = this.membersSvc.getMembers()
        .map((members) =>
          members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
    }
  }

  setFilteredItems1(){
    if (this.searchTerm == null || this.searchTerm == ''){
      //console.log('setFilteredItems: aa');
      this.members = this.membersSvc.getMembers()
        .map((members) => {return members});
    }else{
      //return items.filter(item => item.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);
      this.members = this.membersSvc.getMembers()
        .map((members) =>
          members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1)
        );
    }
  }

  onUpVote(selectedMember: any){
    this.attendanceSvc.addAttendee(this.currentEventId, selectedMember.$key);
  }

  onDownVote(selectedMember: any){
    this.attendanceSvc.removeAttendee(this.currentEventId, selectedMember.$key);
  }

  isVoted(selectedMember: any){
    return this.attendanceSvc.isVoted(this.currentEventId, selectedMember.$key);
  }

  selectedAll(){
    this.members = this.membersSvc.getMembers()
      .map((members) => {return members});
  }

  selectedCircles(){
    //console.log('selectedCircles');
    //TODO: refactor
    //let favs = ["-Ke2CyV2BJ5S3_7qcQj5", "-Ke2CyV2BJ5S3_7qcQj6", "-Ke2CyV39UwBuq36wSM6", "-KeKL1A7J2pcCKAPMvIr"];
    //let userCircles = this.userSvc.getMyCircles();
    //console.log(favs);
    this.searching = false;
    this.members = this.membersSvc.getMembers()
      .map((members) =>
        members.filter(member => this.userCircles.indexOf(member.$key) !== -1)
      );

    if (this.searchTerm == null || this.searchTerm == ''){
      //console.log('setFilteredItems: aa');
      // this.members = this.membersSvc.getMembers()
      //   .map((members) => {return members});
    }else{
      //return items.filter(item => item.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);
      this.members = this.members
        .map((members) =>
          members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
    }
  }

  getVoteCount(selectedMember: any){
    let c = this.attendanceSvc.getUpVotes(this.currentEventId, selectedMember.$key);
    //console.log(c);
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
