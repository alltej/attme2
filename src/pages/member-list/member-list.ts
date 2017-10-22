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

  loading: boolean;
  segment: string = 'all';
  searchControl: FormControl;
  queryText: string = '';
  members: any[] = [];
  public weekNumber: number;
  public pageSize: number = 50;
  public start: number = 0;
  public iMembers: Array<IMember> = [];

  private membersRx: Observable<any[]>;
  private letter: string;
  private ooid: string;
  private aoid: string;
  constructor(
    private navCtrl: NavController,
    private membersSvc: MemberProvider,
    private dataSvc: DataProvider,
    public mappingsService: MappingProvider,
    public itemsSvc: ItemsProvider,
    private userCircleSvc: UserCircleProvider,
    private userData: UserData,
    public events: Events) {
    super();


    this.searchControl = new FormControl();
    this.ooid = this.userData.getCurrentOOID();
    this.aoid = this.userData.getSelectOrgMemberKey();
  }

  ngOnInit() {
    console.log('member-list::ngOnInit')

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.loadMembers2();
      this.loading = false;
    });

  }

  private loadMembers2() {
    let self = this;
    self.loading = true;

    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let alphaArray = str.split("");

    let startFrom: number = self.start - self.pageSize;
    if (startFrom < 0)
      startFrom = 0;

    let startAt = "A"; //alphaArray[startFrom];
    let endAt = "Z"; //alphaArray[self.start + self.pageSize];

    //console.log(`startAt:${startAt}`)
    //console.log(`endAt:${endAt}`)
    //TODO: simplify
    this.dataSvc.getMembersRef(this.ooid)
      .orderByChild('firstname')
      .startAt(startAt)
      .endAt(endAt)
      .once('value', snapshot=> {
        self.mappingsService.getMembers(snapshot)
          .forEach(aMember => {
            if (aMember.photoUrl == null) {
              //aMember.photoUrl = "assets/images/profile-default.png" //"assets/img/avatar-luke.png"
            }
            self.iMembers.push(aMember);
          });
        self.start -= (self.pageSize + 1);
        self.events.publish('members:viewed');
        self.loading = false;
    });
  }

  // public loadMembers() {
  //   this.loading = true;
  //   this.membersRx  =
  //     this.membersSvc.getMembers2(this.userData.getSelectedOrganization())
  //       .takeUntil(this.componentDestroyed$);
  //
  //   if (!(this.queryText == null || this.queryText == '')){
  //     this.membersRx = this.membersRx.map((members) =>
  //       members.filter(member => member.lastName.toLowerCase().includes(this.queryText.toLowerCase()) || member.firstName.toLowerCase().includes(this.queryText.toLowerCase())))
  //   }
  //
  //   this.membersRx.map((members) => {
  //       return members.map(member => {
  //         if (member.photoUrl == null) {
  //           //member.photoUrl = "assets/images/profile-default.png" //"assets/img/avatar-luke.png"
  //         }
  //         //console.log(member.photoUrl);
  //         this.userCircleSvc.isMyCircle(member.$key)
  //           .takeUntil(this.componentDestroyed$)
  //           .map((ul) => {
  //             return ul;
  //           })
  //           .subscribe(data => {
  //             member.isMyCircle = data.$value ? true : false;
  //           });
  //         return member;
  //       })
  //     })
  //     .subscribe((items: any[]) => {
  //       this.members = items;
  //     });
  // }

  onLoadMember(selectedMember:any){
    console.log(selectedMember);
    this.navCtrl.push('MemberDetailPage', {memberKey: selectedMember.memberKey});
  }

  onAddToCircle(selectedMember: any){
    //console.log(`onAddToCircle${selectedMember.$key}`);
    this.userCircleSvc.addToMyCircle(selectedMember.memberKey);
  }

  onRemoveFromCircle(selectedMember: any){
    //console.log('onRemoveFromCircle');
    this.userCircleSvc.removeFromMyCircle(selectedMember.$key);
  }

  isMyCircle(selectedMember: any){
    let isIn:boolean = false;
    this.userCircleSvc.isMyCircle(selectedMember.$key)
      .take(1)
      .subscribe(data => {
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
    //console.log(photoUrl);
    if (photoUrl == null) {
      return "assets/images/avatar-luke.png"
    }else{
      return photoUrl;
    }
  }

  onSearchInput(){
    let self = this;
    self.loadMembers2();
  }
}
