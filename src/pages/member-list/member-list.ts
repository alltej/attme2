import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {MemberProvider} from "../../providers/member/member";

@IonicPage({
  name: 'member-list'
})
@Component({
  selector: 'page-member-list',
  templateUrl: 'member-list.html',
})
export class MemberListPage implements OnInit{
  members: Observable<any[]>;
  constructor(
    private navCtrl: NavController,
    private membersSvc: MemberProvider) {
  }

  ngOnInit() {
    //this.members = this.membersSvc.getMembers();
    this.members = this.membersSvc.getMembers()
      .map( (arr) => { return arr; } );
  }

  onLoadMember(member:any){
    //console.log(member);
    this.navCtrl.push('member-detail', {member: member});
  }

  addToCircle(selectedMember: any){
    //this.attendanceSvc.addAttendee(this.currentEventId, selectedMember.$key);
  }

  removeFromCircle(selectedMember: any){
    //this.attendanceSvc.removeAttendee(this.currentEventId, selectedMember.$key);
  }

  isMyCircle(selectedMember: any){
    //return this.attendanceSvc.isVoted(this.currentEventId, selectedMember.$key);
    return false;
  }

}
