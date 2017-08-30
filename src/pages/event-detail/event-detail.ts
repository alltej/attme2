import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';

@IonicPage({
  name: 'event-detail',
  segment: 'event-detail/:eventId'
})
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage implements OnInit{
  public currentEvent: any = {};
  private eventId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public eventSvc: EventProvider) {
    this.eventId = this.navParams.get('eventId');
  }

  ngOnInit(): void {
    this.eventSvc.getEventDetail(this.eventId)
      .subscribe((data)=>{
        if (data.val()!=null) {
          this.currentEvent = data.val();
        }
      });
  }
}
