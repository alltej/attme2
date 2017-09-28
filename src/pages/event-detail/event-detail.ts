import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import {UserLikesProvider} from "../../providers/user-likes/user-likes";
import {BaseClass} from "../BasePage";
import {FirebaseListObservable} from "angularfire2/database";

@IonicPage({
  name: 'event-detail',
  segment: ':eventId/event-detail'
})
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage extends BaseClass implements OnInit{
  public currentEvent: any = {};
  private eventId: string;
  public isLiked: boolean = false;
  private likedBy: any;
  likedByList: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventSvc: EventProvider,
              private userLikeSvc: UserLikesProvider) {
    super();
    this.eventId = this.navParams.get('eventId');
  }

  ngOnInit(): void {

    this.eventSvc.getEventDetail(this.eventId)
      .subscribe((item: any)=>{
        this.currentEvent = item.val();
        this.currentEvent.eventId = this.eventId;
      });

    this.likedByList = this.eventSvc.getEventLikes(this.eventId);
    //console.log(item)
    this.userLikeSvc.isLiked(this.eventId)
      .subscribe(ul =>{
        if (ul.on != null) {
          //console.log('likeIt:true')
          this.isLiked = true;
        }
      });
  }

  onAddLike(eventId: string){
    //console.log(eventId)
    this.userLikeSvc.addLike(eventId);
    //this.reloadEvents();
  }

  onRemoveLike(eventId: string){
    //console.log(eventId)
    this.userLikeSvc.removeLike(eventId);
    this.isLiked = false;
    //this.reloadEvents();
  }



}
