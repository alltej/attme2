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

  members: Observable<any[]>;
  relationship: any;
  userCircles: any[];

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
    //console.log('EventAttendeesPage::everything works as intended with or without super call');
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
    console.log('setFilteredItems')

      // .takeUntil(this.componentDestroyed$)
      // .map((members) =>
      //   members.filter(member => circleKeys.indexOf(member.$key) !== -1)
      // )
      // .subscribe(m => {
      //   this.members = m;
      // })
    if (this.searchTerm == null || this.searchTerm == ''){
      console.log('setFilteredItems: xx');
      this.members = this.membersSvc.getMembers()
        .takeUntil(this.componentDestroyed$)
        .map((members) => {return members})
    }else{
      console.log('setFilteredItems: zz');

      //return items.filter(item => item.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);
      this.members = this.membersSvc.getMembers()
        .takeUntil(this.componentDestroyed$)
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
    this.members = this.membersSvc.getMembers()
      .map((members) => {return members});
  }

  ngOnInit(): void {
    console.log('EventAttendeesPage::ngOnInit')
    // this.userSvc.getMyCircles()
    //   .takeUntil(this.componentDestroyed$)
    //   .subscribe(itemKeys=>{
    //     itemKeys.forEach(data => {
    //       if (!(data.val().isFinished == false || data.val().isFinished == null)) {
    //         this.userCircles.push(data.$key);
    //       }
    //     });
    //   })
    //return circleKeys;;
  }

  selectedCircles(){
    console.log('EventAttendeesPage::selectedCircles')
    let circleKeys = [];
    this.userSvc.getMyCircles()
      .takeUntil(this.componentDestroyed$)
      .subscribe(itemKeys=>{
        itemKeys.forEach(data => {
          circleKeys.push(data.key);
        });
      })

    console.log(circleKeys);

    this.searching = false;
    this.members =  this.membersSvc.getMembers()
      .takeUntil(this.componentDestroyed$)
      .map((members) => {
          members.filter(member => {
            circleKeys.indexOf(member.$key) !== -1
            return member;
          })
          return members;
        }
      )
    ;
    // this.members = this.membersSvc.getMembers()
    //   .takeUntil(this.componentDestroyed$)
    //   .map((members) => {return members})
    // ;
    console.log(this.members)
    if (this.searchTerm == null || this.searchTerm == ''){
      console.log('setFilteredItems: aa');
      // this.members = this.membersSvc.getMembers()
      //   .map((members) => {return members});
    }else{
      //return items.filter(item => item.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);
      this.members = this.members
        .takeUntil(this.componentDestroyed$)
        .map((members) =>
          members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
    }
    //TODO: refactor
    //let favs = ["-Ke2CyV2BJ5S3_7qcQj5", "-Ke2CyV2BJ5S3_7qcQj6", "-Ke2CyV39UwBuq36wSM6", "-KeKL1A7J2pcCKAPMvIr"];
    //let userCircles = this.userSvc.getMyCircles();
    //console.log(favs);
    // this.searching = false;
    //  this.membersSvc.getMembers()
    //   .takeUntil(this.componentDestroyed$)
    //   .map((members) =>
    //     members.filter(member => this.userCircles.indexOf(member.$key) !== -1)
    //   )
    //   .subscribe(m => {
    //     this.members = m;
    //   })
    //  ;
    //
    // if (this.searchTerm == null || this.searchTerm == ''){
    //   //console.log('setFilteredItems: aa');
    //   // this.members = this.membersSvc.getMembers()
    //   //   .map((members) => {return members});
    // }else{
    //   //return items.filter(item => item.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);
    //   this.members = this.members
    //     .map((members) =>
    //       members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
    // }
  }
  selectedCircles1(){
    //console.log('selectedCircles');
    //TODO: refactor
    //let favs = ["-Ke2CyV2BJ5S3_7qcQj5", "-Ke2CyV2BJ5S3_7qcQj6", "-Ke2CyV39UwBuq36wSM6", "-KeKL1A7J2pcCKAPMvIr"];
    //let userCircles = this.userSvc.getMyCircles();
    //console.log(favs);
    this.searching = false;
     this.membersSvc.getMembers()
      .takeUntil(this.componentDestroyed$)
      .map((members) =>
        members.filter(member => this.userCircles.indexOf(member.$key) !== -1)
      )
      .subscribe(m => {
        this.members = m;
      })
     ;

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
    let c = this.attendanceSvc.getUpVotes(this.currentEventKey, selectedMember.$key);
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
