import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EventCommentsProvider} from "../../providers/event/event-comments";
import {AuthProvider} from "../../providers/auth/auth";
import {IUser} from "../../models/user.interface";
import {IComment} from "../../models/comment.interface";
import {ProfileProvider} from "../../providers/profile/profile";
import {DataProvider} from "../../providers/data/data";


@IonicPage({
  name: 'comment-create',
  segment: ':eventId/comment-create'
})
@Component({
  selector: 'page-comment-create',
  templateUrl: 'comment-create.html',
})
export class CommentCreatePage implements OnInit{

  createCommentForm: FormGroup;
  comment: AbstractControl;
  eventId: string;
  loaded: boolean = false;

  constructor(public nav: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              public fb: FormBuilder,
              public authService: AuthProvider,
              public profileSvc: ProfileProvider,
              private dataSvc: DataProvider,
              public commentsSvc: EventCommentsProvider) {
  }

  ngOnInit() {
    //console.log(`CommentCreatePage::ngOnInit`);
    this.eventId = this.navParams.get('eventId');
    //console.log(this.eventId)
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
    //console.log('ionViewDidLoad CommentCreatePage');
  }

  onSubmit(commentForm: any): void {
    if (this.createCommentForm.valid) {

      let loader = this.loadingCtrl.create({
        content: 'Posting comment...',
        dismissOnPageChange: true
      });

      loader.present();

      let uid = this.authService.getLoggedInUser().uid;
      //console.log(`uid::${uid}`)

      const userId = this.authService.getLoggedInUser().uid
      this.dataSvc.usersRef.child(`${userId}/profile`).once('value').then(snapshot => {
        let username  =  snapshot.val().lastName + " " + snapshot.val().firstName.charAt(0)
        //console.log(`username::${username}`)

        let commentRef = this.commentsSvc.getCommentsRef().push();
        let commentkey: string = commentRef.key;
        let user: IUser = { uid: uid, username: username };

        let newComment: IComment = {
          key: commentkey,
          text: commentForm.comment,
          event: this.eventId,
          user: user,
          dateCreated: new Date().toString(),
          votesUp: null,
          votesDown: null
        };

        this.commentsSvc.submitComment(this.eventId, newComment)
          .then(snapshot => {
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
