import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EventCommentsProvider} from "../../providers/event/event-comments";
import {AuthProvider} from "../../providers/auth/auth";
import {IUser} from "../../models/user.interface";
import {IComment} from "../../models/comment.interface";
import {ProfileProvider} from "../../providers/profile/profile";
import {DataProvider} from "../../providers/data/data";
import {UserData} from "../../providers/data/user-data";


@IonicPage()
@Component({
  selector: 'page-comment-create',
  templateUrl: 'comment-create.html',
})
export class CommentCreatePage implements OnInit{

  createCommentForm: FormGroup;
  comment: AbstractControl;
  eventId: string;
  loaded: boolean = false;
  private ooid: string;

  constructor(public nav: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              public fb: FormBuilder,
              public authService: AuthProvider,
              public profileSvc: ProfileProvider,
              private dataSvc: DataProvider,
              private userData: UserData,
              public commentsSvc: EventCommentsProvider) {
  }

  ngOnInit() {
    //console.log(`CommentCreatePage::ngOnInit`);
    this.eventId = this.navParams.get('eventId');
    this.ooid = this.userData.getCurrentOOID();

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
      console.log(`uid::${uid}`)

      //TODO: Get this user data from UserData service
      //TODO: Need to have name node in users/uid/profile
      const userId = this.authService.getLoggedInUser().uid
      this.dataSvc.usersRef.child(`${userId}/profile`).once('value').then(snapshot => {
        let username: string = "FT";
        if (snapshot.val()) {
          //username  =  snapshot.val().lastname + " " + snapshot.val().firstname.charAt(0)
        }
        //console.log(`username::${username}`)

        let commentRef = this.commentsSvc.getEventCommentsRef(this.ooid, this.eventId).push();
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

        this.commentsSvc.submitComment(this.userData.ooid, this.eventId, newComment)
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
      }).catch( error =>{
        // console.log(error)
        // loader.dismiss()
      });
    }
  }
}
