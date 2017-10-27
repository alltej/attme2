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
  //private ooid: string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userData: UserData,
              private dataSvc: DataProvider,
              private memberSvc: MemberProvider) {

  }

  ngOnInit(): void {
    // this.userData.getCurrentOOID().then(oid=>{
    //   this.ooid = oid;
    // });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MemberCreatePage');
  }

  createMember(firstname: string, lastname: string, memberId: string, email: string) {
    //console.log(`createMember::this.userData.ooid==${this.userData.ooid}`)
    let newItemRef = this.dataSvc.getOrgsRef().child(`${this.userData.currentOOId}/members`).push();
    let newItemKey: string = newItemRef.key;

    let textAvatar = firstname.charAt(0) + lastname.charAt(0)

    let newMember: INewMember = {
      uid: null,
      memberKey : newItemKey,
      email: email,
      birthDate: null,
      firstname: firstname,
      lastname: lastname,
      memberId: memberId,
      textAvatar: textAvatar
    };

    this.memberSvc.createMember3(newMember)
      .then( newEvent => {
        this.navParams.get("parentPage").loadMembers();
        this.navCtrl.pop();
    });
  }


}
