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
  private eventDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public eventSvc: EventProvider) {
    this.eventDate = new Date().toISOString();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EventCreatePage');
  }


  createEvent(name:string, description:string, eventDate:string, location:string) {
    let when = new Date(eventDate).toISOString().slice(0,10)
    this.eventSvc.createEvent(name, description, when, location)
      .then( newEvent => {
        this.navParams.get("parentPage").loadEvents(true);
        this.navCtrl.pop();
      });
  }
}
