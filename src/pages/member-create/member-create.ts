import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MemberProvider} from "../../providers/member/member";
import {UserData} from "../../providers/data/user-data";
import {IMember, INewMember} from "../../models/member.interface";
import {DataProvider} from "../../providers/data/data";

@IonicPage({
  name: 'member-create'
})
@Component({
  selector: 'page-member-create',
  templateUrl: 'member-create.html',
})
export class MemberCreatePage implements OnInit{

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userData: UserData,
              private dataSvc: DataProvider,
              private memberSvc: MemberProvider) {
  }

  ngOnInit(): void {
    console.log(this.userData.getSelectedOrganization())
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad MemberCreatePage');
  }

  createMember(firstName: string, lastName: string, memberId: string, email: string) {
    let newItemRef = this.dataSvc.getOrgsRef().child(`${this.userData.getSelectedOrganization()}/members`).push();
    let newItemKey: string = newItemRef.key;

    let newMember: INewMember = {
      uid: null,
      memberKey : newItemKey,
      email: email,
      birthDate: null,
      firstName: firstName,
      lastName: lastName,
      memberId: memberId
    };

    this.memberSvc.createMember3(this.userData.getSelectedOrganization(),newMember)
      .then( newEvent => {
        this.navParams.get("parentPage").loadMembers2();
        this.navCtrl.pop();
    });
  }


}
