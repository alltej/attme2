import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MemberProvider} from "../../providers/member/member";

@IonicPage({
  name: 'member-create'
})
@Component({
  selector: 'page-member-create',
  templateUrl: 'member-create.html',
})
export class MemberCreatePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private memberSvc: MemberProvider) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MemberCreatePage');
  }

  createMember(firstName: string, lastName: string, memberId: string, email: string) {
    this.memberSvc.createMember(firstName, lastName, memberId, email)
      .then( newEvent => {
        this.navParams.get("parentPage").loadMembers();
        this.navCtrl.pop();
    });
  }


}
