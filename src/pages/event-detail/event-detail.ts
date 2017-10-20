import {Component, OnInit} from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import {UserLikesProvider} from "../../providers/user-likes/user-likes";
import {BaseClass} from "../BasePage";
import {FirebaseListObservable} from "angularfire2/database";
import {UserData} from "../../providers/data/user-data";

@IonicPage({
  name: 'event-detail',
  segment: ':eventId/event-detail'
})
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage extends BaseClass implements OnInit{
  public selEvent: any = {};
  private eventId: string;
  public isLiked: boolean = false;
  private likedBy: any;
  likedByList: FirebaseListObservable<any[]>;
  private ooid: string;
  private aoid: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              public eventSvc: EventProvider,
              private userLikeSvc: UserLikesProvider,
              private userData: UserData,
              public events: Events) {
    super();
    this.eventId = this.navParams.get('eventId');
    this.ooid = this.userData.getCurrentOOID();
    this.aoid = this.userData.getSelectOrgMemberKey();
  }

  ngOnInit(): void {
    //console.log(`EventDetailPage::ngOnInit::${this.eventId}`)
    this.eventSvc.getEventDetail(this.ooid, this.eventId)
      .subscribe((item: any)=>{
        this.selEvent = item.val();
        this.selEvent.eventId = this.eventId;
      });

    this.likedByList = this.eventSvc.getEventLikes(this.ooid, this.eventId);
    //console.log(item)
    this.userLikeSvc.isLiked(this.ooid, this.eventId)
      .subscribe(ul =>{
        if (ul.on != null) {
          //console.log('likeIt:true')
          this.isLiked = true;
        }
      });
  }

  onAddLike(eventKey: string){
    //console.log(`AA::onAddLike::${eventKey}`)
    this.userLikeSvc.addLike(this.ooid, eventKey);

    this.events.publish('reloadPage1', true);
    //console.log(`BB::onAddLike::publish`)
  }

  onRemoveLike(eventKey: string){
    //console.log(eventId)
    this.userLikeSvc.removeLike(this.ooid, eventKey);
    this.isLiked = false;
  }

  onUpdateDate(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newDate',
          value: this.selEvent.when,
          placeholder: 'New Date(MM/YY/DDDD)',
          type: 'date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.eventSvc.updateEventDate(this.selEvent.eventId, data.newDate).then( () =>{
              this.reloadParent()
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  onUpdateName(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newName',
          value: this.selEvent.name,
          placeholder: 'New Event Name',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.eventSvc.updateEventName(this.selEvent.eventId, data.newName).then( () =>{
              this.reloadParent()
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  onUpdateLocation(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newLocation',
          value: this.selEvent.where,
          placeholder: 'New Event Location',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.eventSvc.updateEventLocation(this.selEvent.eventId, data.newLocation).then( () =>{
              this.reloadParent()
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  onUpdateDescription(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newDescription',
          value: this.selEvent.description,
          placeholder: 'New Event Description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.eventSvc.updateEventDescription(this.selEvent.eventId, data.newDescription).then( () =>{
              this.reloadParent()
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  private reloadParent(){
    this.navParams.get("parentPage").loadEvents(true);
  }
}
