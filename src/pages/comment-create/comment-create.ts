import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EventCommentsProvider} from "../../providers/event/event-comments";
import {AuthProvider} from "../../providers/auth/auth";
import {IUser} from "../../models/user.interface";
import {IComment} from "../../models/comment.interface";
import {ProfileProvider} from "../../providers/profile/profile";


@IonicPage()
@Component({
  selector: 'page-comment-create',
  templateUrl: 'comment-create.html',
})
export class CommentCreatePage implements OnInit{

  createCommentForm: FormGroup;
  comment: AbstractControl;
  eventKey: string;
  loaded: boolean = false;

  constructor(public nav: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              public fb: FormBuilder,
              public authService: AuthProvider,
              public profileSvc: ProfileProvider,
              public commentsSvc: EventCommentsProvider) {
  }

  ngOnInit() {
    this.eventKey = this.navParams.get('eventId');

    this.createCommentForm = this.fb.group({
      'comment': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });

    this.comment = this.createCommentForm.controls['comment'];
    this.loaded = true;
  }

  cancelNewComment() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentCreatePage');
  }

  onSubmit(commentForm: any): void {
    if (this.createCommentForm.valid) {

      let loader = this.loadingCtrl.create({
        content: 'Posting comment...',
        dismissOnPageChange: true
      });

      loader.present();

      let uid = this.authService.getActiveUser().uid;
      //const userId = this.authService.getActiveUser().uid;
      this.profileSvc.getUserProfile().once('value').then(snapshot => {
        let username  =  snapshot.val().lastName + " " + snapshot.val().firstName.charAt(0)

        let commentRef = this.commentsSvc.getCommentsRef().push();
        let commentkey: string = commentRef.key;
        let user: IUser = { uid: uid, username: username };

        let newComment: IComment = {
          key: commentkey,
          text: commentForm.comment,
          thread: this.eventKey,
          user: user,
          dateCreated: new Date().toString(),
          votesUp: null,
          votesDown: null
        };

        this.commentsSvc.submitComment(this.eventKey, newComment)
          .then(function (snapshot) {
            loader.dismiss()
              .then(() => {
                this.viewCtrl.dismiss({
                  comment: newComment,
                  user: user
                });
              });
          }, function (error) {
            // The Promise was rejected.
            console.error(error);
            loader.dismiss();
          });
      });
    }
  }
}
