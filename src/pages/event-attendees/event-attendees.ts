import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'event-attendees'
})
@Component({
  selector: 'page-event-attendees',
  templateUrl: 'event-attendees.html',
})
export class EventAttendeesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventAttendeesPage');
  }

}
