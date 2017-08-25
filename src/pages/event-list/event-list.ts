import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
@IonicPage({
  name: 'event-list'
})
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage implements OnInit {


  ngOnInit(): void {
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //this.menu.enable(true);
  }

  onNewEvent(){
    this.navCtrl.push('event-create', {'parentPage': this});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventListPage');
  }

}
