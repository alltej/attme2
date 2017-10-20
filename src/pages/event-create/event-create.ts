import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventProvider} from "../../providers/event/event";
import {UserData} from "../../providers/data/user-data";
import {DataProvider} from "../../providers/data/data";
import {IEvent, INewEvent} from "../../models/event.interface";

@IonicPage({
  name: 'event-create'
})
@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {
  private eventDate: string;
  private ooid: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventSvc: EventProvider,
              private userData: UserData,
              private dataSvc: DataProvider) {
    this.eventDate = new Date().toISOString();
    this.ooid = this.userData.getSelectedOrganization();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EventCreatePage');
  }


  createEvent(name:string, description:string, eventDate:string, location:string) {
    let newItemRef = this.dataSvc.getOrgsRef().child(`${this.userData.getSelectedOrganization()}/events`).push();
    let newItemKey: string = newItemRef.key;

    let when = new Date(eventDate).toISOString().slice(0,10)
    let newItem: INewEvent = {
      key: newItemKey,
      description: description,
      name: name,
      when: when,
      where:location,
    };

    this.eventSvc.createEvent2(this.ooid, newItem)
      .then( newEvent => {
        this.navParams.get("parentPage").loadEvents(true);
        this.navCtrl.pop();
      });


  }
}
