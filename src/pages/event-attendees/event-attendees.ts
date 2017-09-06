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
  private membersRx: Observable<any[]>;
  private membersRx2: any[] = [];
//speakers: any[] = [];
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
    // if (this.membersSvc != null && this.membersSvc.eventAttendeeVoteCount != null) {
    //   console.log('this.membersSvc.eventAttendeeVoteCount is null');
    //   this.membersSvc.eventAttendeeVoteCount.unsubscribe();
    // }
    console.log('a::EventAttendeesPage::everything works as intended with or without super call');
    //this.membersSvc.eventAttendeeVoteCount.unsubscribe();
    //this.userSvc.circlesSub.unsubscribe();
    console.log('z::EventAttendeesPage::everything works as intended with or without super call');
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

  setFilteredItems(userCircles?: any[]){
    this.membersRx =  this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
      .takeUntil(this.componentDestroyed$);
    if (!(this.searchTerm == null || this.searchTerm == '')){
      console.log(`search term::${this.searchTerm}`)
      this.membersRx = this.membersRx.map((members) =>
        members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1))
    }
    if (userCircles){
      this.membersRx = this.membersRx
        .map((members) =>
          members.filter(member => this.userCircles.indexOf(member.$key) !== -1)
        );
    }

    this.membersRx
      .map(members =>{
        return members.map(member =>{
          this.attendanceSvc.getMemberVoteCount(this.currentEventKey, member.$key)
            .takeUntil(this.componentDestroyed$)
            .map( (ul) =>{
              return ul;
            })//member.voteCount = vote.voteCount;
            .subscribe(ul =>{
              if (ul.votes != null){
                console.log(ul.votes)
              }
              member.voteCount = ul.voteCount != null ? ul.voteCount : null;
            });
          return member;
        })
        //return members;
      }) //TODO
      .map(members =>{
        return members.map(member =>{
          this.attendanceSvc.isVoted(this.currentEventKey, member.$key)
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
        this.membersRx2 = items;
      });
    // if (this.searchTerm == null || this.searchTerm == ''){
    //   this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
    //     .takeUntil(this.componentDestroyed$)
    //     .map(members =>{
    //       return members.map(member =>{
    //         this.attendanceSvc.getMemberVoteCount(this.currentEventKey, member.$key)
    //           .takeUntil(this.componentDestroyed$)
    //           .map( (ul) =>{
    //             return ul;
    //           })//member.voteCount = vote.voteCount;
    //           .subscribe(ul =>{
    //             if (ul.votes != null){
    //               console.log(ul.votes)
    //             }
    //             member.voteCount = ul.voteCount != null ? ul.voteCount : 0;
    //           });
    //         return member;
    //       })
    //       //return members;
    //     }) //TODO
    //     .map(members =>{
    //       return members.map(member =>{
    //         this.attendanceSvc.isVoted(this.currentEventKey, member.$key)
    //           .takeUntil(this.componentDestroyed$)
    //           .map( (ul) =>{
    //             //console.log(ul)
    //             return ul;
    //           })//member.voteCount = vote.voteCount;
    //           .subscribe(ul =>{
    //             member.isVoted = ul.on != null ? true : false;
    //           });
    //         return member;
    //       })
    //       //return members;
    //     })
    //     .subscribe(items =>{
    //       this.membersRx = items;
    //     });
    //   //return this.membersWithVoteCount;
    // }else{
    //   this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
    //     .takeUntil(this.componentDestroyed$)
    //     .map((members) =>
    //       members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1))
    //     .map(members =>{
    //       return members.map(member =>{
    //         this.attendanceSvc.getMemberVoteCount(this.currentEventKey, member.$key)
    //           .takeUntil(this.componentDestroyed$)
    //           .map( (ul) =>{
    //             return ul;
    //           })//member.voteCount = vote.voteCount;
    //           .subscribe(ul =>{
    //             if (ul.voteCount != null) {
    //               member.voteCount = ul.voteCount;
    //             }
    //             else{
    //               //console.log('likeIt:false')
    //               member.voteCount = 0;
    //             }
    //           });
    //         return member;
    //       })
    //       //return members;
    //     })
    //     .subscribe(items =>{
    //       this.membersRx = items;
    //     });
    //   ;
    // }

  }
  setFilteredItems1(){
    if (this.searchTerm == null || this.searchTerm == ''){
      this.members = this.membersSvc.getMembersWithVoteCountO(this.currentEventKey)
        .takeUntil(this.componentDestroyed$);
    }else{
      this.members = this.membersSvc.getMembersWithVoteCountO(this.currentEventKey)
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
            this.attendanceSvc.getMemberVoteCount(this.currentEventKey, item.$key)
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
    return true;
    //return this.attendanceSvc.isVoted(this.currentEventKey, selectedMember.$key);
  }

  selectedAll(){
    this.setFilteredItems();
    // this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
    //   .takeUntil(this.componentDestroyed$)
    //   .map((members) => {return members});
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
    console.log(this.userCircles);
    this.setFilteredItems(this.userCircles);
    this.searching = false;
    // this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
    //   .takeUntil(this.componentDestroyed$)
    //   .map((members) =>
    //     members.filter(member => this.userCircles.indexOf(member.$key) !== -1)
    //   );
    // console.log(this.members)
    // if (this.searchTerm == null || this.searchTerm == ''){
    //   //console.log('setFilteredItems: aa');
    // }else{
    //   this.members = this.members
    //     .map((members) =>
    //       members.filter(member => member.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || member.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
    // }

  }
  selectedCirclesO(){
    console.log(this.userCircles);
    this.searching = false;
    this.members = this.membersSvc.getMembersWithVoteCount(this.currentEventKey)
      .takeUntil(this.componentDestroyed$)
      .map((members) =>
        members.filter(member => this.userCircles.indexOf(member.$key) !== -1)
      );
    console.log(this.members)
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

  private setFilteredItemsWithCircles(userCircles: any[]) {

  }
}
