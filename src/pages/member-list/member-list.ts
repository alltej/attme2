import {Component, OnDestroy, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MemberProvider} from "../../providers/member/member";
import {UserCircleProvider} from "../../providers/user-circle/user-circle";
import {BaseClass} from "../BasePage";

@IonicPage()
@Component({
  selector: 'page-member-list',
  templateUrl: 'member-list.html',
})
export class MemberListPage extends BaseClass implements OnInit, OnDestroy{

  //private events: any[] = [];
  members: any[] = [];
  constructor(
    private navCtrl: NavController,
    private membersSvc: MemberProvider,
    private userCircleSvc: UserCircleProvider) {
    super();
  }

  ngOnInit() {
    this.membersSvc.getMembers()
      .takeUntil(this.componentDestroyed$)
      .map( (members) => {
        return members.map(member =>{
          if (member.photoUrl == null) {
            member.photoUrl = "assets/images/profile-default.png" //"assets/img/avatar-luke.png"
          }
          //console.log(member.photoUrl);
          this.userCircleSvc.isMyCircle(member.$key)
            .takeUntil(this.componentDestroyed$)
            .map( (ul) =>{
              return ul;
            })
            .subscribe(data => {
              member.isMyCircle = data.$value ? true:false;
            });
          return member;
        })
      } )
      .subscribe((items: any[]) =>{
        this.members = items;
      });
  }

  onLoadMember(selectedMember:any){
    //console.log(selectedMember);
    this.navCtrl.push('member-detail', {memberKey: selectedMember.$key});
  }

  onAddToCircle(selectedMember: any){
    //console.log(`onAddToCircle${selectedMember.$key}`);
    this.userCircleSvc.addToMyCircle(selectedMember.$key);
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
}
