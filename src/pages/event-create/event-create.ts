import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventProvider} from "../../providers/event/event";
import {UserData} from "../../providers/data/user-data";
import {DataProvider} from "../../providers/data/data";
import {IEvent} from "../../models/event.interface";

@IonicPage({
  name: 'event-create'
})
@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {
  private eventDate: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventSvc: EventProvider,
              private userData: UserData,
              private dataSvc: DataProvider) {
    this.eventDate = new Date().toISOString();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EventCreatePage');
  }


  createEvent(name:string, description:string, eventDate:string, location:string) {
    let newItemRef = this.dataSvc.getOrgsRef().child(`${this.userData.getSelectedOrganization()}/events`).push();
    let newItemKey: string = newItemRef.key;

    let when = new Date(eventDate).toISOString().slice(0,10)
    let newItem: IEvent = {
      key: newItemKey,
      description: description,
      name: name,
      when: when,
      where:location,
      likes: null,
      comments: null,
      attendees: null,
      isLiked:null,
    };



    this.eventSvc.createEvent2(this.userData.getSelectedOrganization(), newItem)
      .then( newEvent => {
        this.navParams.get("parentPage").loadEvents(true);
        this.navCtrl.pop();
      });


  }
}
