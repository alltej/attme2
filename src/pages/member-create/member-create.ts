import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'member-create'
})
@Component({
  selector: 'page-member-create',
  templateUrl: 'member-create.html',
})
export class MemberCreatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberCreatePage');
  }

}
