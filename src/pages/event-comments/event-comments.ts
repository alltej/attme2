import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ModalController, ToastController} from 'ionic-angular';
import {BaseClass} from "../BasePage";
import {IComment} from "../../models/comment.interface";
import {Observable} from "rxjs/Observable";
import {EventCommentsProvider} from "../../providers/event/event-comments";
import {AuthProvider} from "../../providers/auth/auth";
import {MappingProvider} from "../../providers/mapper/mapping";
import {UserData} from "../../providers/data/user-data";

@IonicPage({
  name: 'event-comments',
  segment: ':eventId/event-comments'
})
@Component({
  selector: 'page-event-comments',
  templateUrl: 'event-comments.html',
})
export class EventCommentsPage  extends BaseClass implements OnInit, OnDestroy {

  @ViewChild(Content) content: Content;
  eventId: string;
  eventName: string = "";
  commentsLoaded: boolean = false;
  comments: IComment[];

  //private ooid: string;
  constructor(
        public commentsSvc: EventCommentsProvider,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public mappingsService: MappingProvider,
        public navCtrl: NavController,
        public userData: UserData,
        public navParams: NavParams) {
    super();
  }

  ngOnInit(): void {
    this.eventId = this.navParams.get('eventId');
    this.commentsLoaded = false;

    // this.userData.getCurrentOOID().then(oid=>{
    //   this.ooid = oid;
    // });
    //TODO: Get event name from param
    this.commentsSvc.getEvent(this.eventId)
      .then(snapshot => {
        if (snapshot.val() == null) return null;
        let eventData: any = snapshot.val();

        this.eventName = eventData.name;
      })
//.child(self.userData.getSelectedOrganization())
    this.commentsSvc.getEventCommentsRef(this.userData.currentOOId,this.eventId)
      .orderByChild('dateCreated')
      .once('value', snapshot =>  {
        this.comments = this.mappingsService.getComments(snapshot).reverse();
        this.commentsLoaded = true;
      }, error => {
        //console.log(error)
      });
    // this.commentsSvc.getEventCommentsRef(this.eventId).once('value', snapshot =>  {
    //   this.comments = this.mappingsService.getComments(snapshot);
    //   this.commentsLoaded = true;
    //   }, error => {
    //   //console.log(error)
    // });
    this.commentsLoaded = true;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EventCommentsPage');
  }

  getEventData() {


  }

  createComment() {
    let modalPage = this.modalCtrl.create('CommentCreatePage', {
      eventId: this.eventId
    });

    modalPage.onDidDismiss((commentData: any) => {
      if (commentData) {
        let commentVals = commentData.comment;
        let commentUser = commentData.user;

        let createdComment: IComment = {
          key: commentVals.key,
          event: commentVals.event,
          text: commentVals.text,
          user: commentUser,
          dateCreated: commentVals.dateCreated,
          votesUp: null,
          votesDown: null
        };

        this.comments.push(createdComment);
        this.scrollToBottom();

        let toast = this.toastCtrl.create({
          message: 'Comment created',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    });

    modalPage.present();
  }

  scrollToBottom() {
    this.content.scrollToBottom();
  }

}
