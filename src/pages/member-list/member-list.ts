import {Component, OnDestroy, OnInit} from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import {MemberProvider} from "../../providers/member/member";
import {UserCircleProvider} from "../../providers/user-circle/user-circle";
import {BaseClass} from "../BasePage";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {DataProvider} from "../../providers/data/data";
import {IMember} from "../../models/member.interface";
import {ItemsProvider} from "../../providers/mapper/items-provider";
import {MappingProvider} from "../../providers/mapper/mapping";
import {UserData} from "../../providers/data/user-data";

@IonicPage({
  segment: 'members-list'
})
@Component({
  selector: 'page-member-list',
  templateUrl: 'member-list.html',
})
export class MemberListPage extends BaseClass implements OnInit, OnDestroy{

  loading: boolean = false;
  segment: string = 'all';
  searchControl: FormControl;
  queryText: string = '';
  members: any[] = [];
  public pageSize: number = 50;
  public start: number = 0;
  public iMembers: Array<IMember> = [];
   myCircleMemberKeys: any[];
  //userCircles: any[];
  //private ooid: string;
  private aoid: string;

  private membersRx: Observable<any[]>;
  private circlesRx: Observable<any[]>;
  constructor(
    private navCtrl: NavController,
    private dataSvc: DataProvider,
    private membersSvc: MemberProvider,
    public mappingsService: MappingProvider,
    private userCircleSvc: UserCircleProvider,
    private userData: UserData,
    public events: Events) {
    super();


    this.searchControl = new FormControl();

  }

  ngOnInit() {
    let self = this;

    self.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      self.loadMembers();
      self.loading = false;
    });


  }

  // private loadMembers2() {
  //   let self = this;
  //   self.loading = true;
  //   self.iMembers = [];
  //
  //
  //
  //   let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //   let alphaArray = str.split("");
  //
  //   let startFrom: number = self.start - self.pageSize;
  //   if (startFrom < 0)
  //     startFrom = 0;
  //
  //   let startAt = "A"; //alphaArray[startFrom];
  //   let endAt = "Z"; //alphaArray[self.start + self.pageSize];
  //
  //   // self.myCircleMemberKeys = [];
  //   // self.myCircleMemberKeys = this.userCircleSvc.getMyCircles1();
  //   //console.log(`self.myCircleMemberKeys.length==${this.userCircleSvc.getMyCircles1().length}`)
  //   //TODO: simplify
  //   this.dataSvc.getMembersRef(this.userData.currentOOId)
  //     .orderByChild('firstname')
  //     .startAt(startAt)
  //     .endAt(endAt)
  //     .once('value', snapshot=> {
  //       self.mappingsService.getMembers(snapshot)
  //         .forEach(aMember => {
  //
  //           if (self.myCircleMemberKeys.indexOf(aMember.memberKey) > -1) {
  //             aMember.isMyCircle = true
  //           }else{
  //             aMember.isMyCircle = false
  //           }
  //           // self.myCircleMemberKeys.forEach(m =>{
  //           //   console.log(m)
  //           // })
  //           if (aMember.photoUrl == null) {
  //             //aMember.photoUrl = "assets/images/profile-default.png" //"assets/img/avatar-luke.png"
  //           }
  //           self.iMembers.push(aMember);
  //         });
  //       self.start -= (self.pageSize + 1);
  //       self.events.publish('members:viewed');
  //       self.loading = false;
  //   });
  // }

  public loadMembers() {
    this.loading = true;
    // this.membersRx =  this.membersSvc.getMembersForEvent(this.userData.currentOOId, this.eventId)
    //   .takeUntil(this.componentDestroyed$);
    //
     this.circlesRx = this.userCircleSvc.getMyCirclesRx()
        .takeUntil(this.componentDestroyed$)

    this.circlesRx.map((members) => {
      return members.map(member => {
        return member.$key
      })
     }).subscribe((items: any[]) =>{
       this.myCircleMemberKeys = items;
    });

    this.membersRx  =
      this.membersSvc.getMembersRx(this.userData.currentOOId)
        .takeUntil(this.componentDestroyed$);

    if (!(this.queryText == null || this.queryText == '')){
      this.membersRx = this.membersRx.map((members) =>
        members.filter(member => member.lastname.toLowerCase().includes(this.queryText.toLowerCase()) || member.firstname.toLowerCase().includes(this.queryText.toLowerCase())))
    }

    this.membersRx.map((members) => {
        return members.map(member => {
          if (member.photoUrl == null) {
            //member.photoUrl = "assets/images/profile-default.png" //"assets/img/avatar-luke.png"
          }

          // console.log(`IsInCircle::member.memberKey==${member.memberKey}`)
          // if (this.myCircleMemberKeys.indexOf(member.memberKey) > -1) {
          //   member.isMyCircle = true
          // }else{
          //   member.isMyCircle = false
          // }

          //console.log(member.photoUrl);
          this.userCircleSvc.isMyCircle(member.$key)
            .takeUntil(this.componentDestroyed$)
            .map((ul) => {
              return ul;
            })
            .subscribe(data => {
              member.isMyCircle = data.$value ? true : false;
            });
          return member;
        })
      })
      .subscribe((items: any[]) => {
        //this.members = items;
        this.iMembers = items;
        this.loading = true;
      });

  }

  onLoadMember(selectedMember:any){
    this.navCtrl.push('MemberDetailPage', {memberKey: selectedMember.memberKey});
  }

  onAddToCircle(selectedMember: any){
    let self = this;
    self.userCircleSvc.addToMyCircle(selectedMember.memberKey);
    //this.loadMembers2()
  }

  onRemoveFromCircle(selectedMember: any){
    this.userCircleSvc.removeFromMyCircle(selectedMember.memberKey);
    //this.loadMembers2()
  }

  isMyCircle(selectedMember: any){
    let isIn:boolean = false;
    this.userCircleSvc.isMyCircle(selectedMember.$key)
      .take(1)
      .subscribe(data => {
        //this.selEvent = item.val();
        if(data.val()==null) {
          isIn = false;
        } else {
          isIn = true;
        }
      });
    return isIn;
  }

  onCreateMember(){
    this.navCtrl.push('member-create', {'parentPage': this});
  }

  getAvatar(photoUrl: String) {
    if (photoUrl == null) {
      return "assets/images/avatar-luke.png"
    }else{
      return photoUrl;
    }
  }

  onSearchInput(){
    let self = this;
    self.loadMembers();
  }
}
