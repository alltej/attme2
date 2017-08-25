import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventProvider} from "../../providers/event/event";

@IonicPage({
  name: 'event-create'
})
@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public eventProvider: EventProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventCreatePage');
  }


  createEvent(eventName:string, eventDescription:string, eventDate:string, eventLocation:string) {
    this.eventProvider.createEvent(eventName, eventDescription, eventDate, eventLocation)
      .then( newEvent => {
        this.navCtrl.pop();
      });
  }
}
