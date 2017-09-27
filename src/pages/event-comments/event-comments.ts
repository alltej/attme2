import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ModalController, ToastController} from 'ionic-angular';
import {BaseClass} from "../BasePage";
import {IComment} from "../../models/comment.interface";
import {Observable} from "rxjs/Observable";
import {EventCommentsProvider} from "../../providers/event/event-comments";
import {AuthProvider} from "../../providers/auth/auth";
import {CommentCreatePage} from "../comment-create/comment-create";
import {MappingProvider} from "../../providers/mapper/mapping";

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
  commentsLoaded: boolean = false;
  comments: IComment[];

  private membersRx: Observable<any[]>;
  constructor(
        public commentsSvc: EventCommentsProvider,
        public authSvc: AuthProvider,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public mappingsService: MappingProvider,
        public navCtrl: NavController,
        public navParams: NavParams) {
    super();

  }

  ngOnInit(): void {
    this.eventId = this.navParams.get('eventId');
    this.commentsLoaded = false;

    this.commentsSvc.getEventCommentsRef(this.eventId).once('value', snapshot =>  {
      this.comments = this.mappingsService.getComments(snapshot);
      this.commentsLoaded = true;
    }, function (error) {
      console.log(error)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventCommentsPage');
  }

  createComment() {
    let self = this;

    let modalPage = this.modalCtrl.create(CommentCreatePage, {
      threadKey: this.eventId
    });

    modalPage.onDidDismiss((commentData: any) => {
      if (commentData) {
        let commentVals = commentData.comment;
        let commentUser = commentData.user;

        let createdComment: IComment = {
          key: commentVals.key,
          thread: commentVals.thread,
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
