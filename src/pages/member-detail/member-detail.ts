import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MemberProvider} from "../../providers/member/member";
import {FirebaseObjectObservable} from "angularfire2/database";
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage({
  name: 'member-detail',
  segment: 'member-detail/:memberId'
})
@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html',
})
export class MemberDetailPage implements OnInit{
  private memberId: any;

  public member: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private memberSvc: MemberProvider,
              private authSvc: AuthProvider) {
    this.memberId = this.navParams.get('memberId');
  }

  ngOnInit(): void {
    //console.log(this.memberId);
    this.memberSvc.getMember(this.memberId)
      .subscribe((data)=>{
        if (data.val()!=null) {
          this.member = data.val();
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberDetailPage');
  }

  onEditMember() {
    //this.navCtrl.push(EditMemberPage, {mode: 'Edit', member: this.member});
  }

  onAddToMyCircle(){
    //console.log('onAddToMyCircle');
    //console.log(memberKey);
    //this.memberSvc.addToMyCircle(this.member.$key);
  }

  onRemoveToMyCircle(){
    //console.log('onAddToMyCircle');
    //console.log(memberKey);
    //this.memberSvc.removeToMyCircle(this.member.$key);
  }

  onCreateInvite(email:string) {
    console.log(email);
    this.authSvc.createUserInvite(email);

  }
}
