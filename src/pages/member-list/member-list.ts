import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {MemberProvider} from "../../providers/member/member";
import {UserCircleProvider} from "../../providers/user-circle/user-circle";

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
    private membersSvc: MemberProvider,
    private userCircleSvc: UserCircleProvider) {
  }

  ngOnInit() {
    //this.members = this.membersSvc.getMembers();
    this.members = this.membersSvc.getMembers()
      .map( (arr) => { return arr; } );
  }

  onLoadMember(selectedMember:any){
    //console.log(member);
    this.navCtrl.push('member-detail', {memberId: selectedMember.$key});
  }

  onAddToCircle(selectedMember: any){
    //console.log('onAddToCircle');
    this.userCircleSvc.addToMyCircle(selectedMember.$key);
  }

  onRemoveFromCircle(selectedMember: any){
    //console.log('onRemoveFromCircle');
    this.userCircleSvc.removeFromMyCircle(selectedMember.$key);
  }

  isMyCircle(selectedMember: any){
    return this.userCircleSvc.isMyCircle(selectedMember.$key);
  }

  onCreateMember(){
    this.navCtrl.push('member-create', {'parentPage': this});
  }

}
