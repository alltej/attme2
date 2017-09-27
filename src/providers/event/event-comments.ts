
import {Injectable} from "@angular/core";
import {FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/Rx';
import {AuthProvider} from "../auth/auth";

import * as firebase from 'firebase';
import {IComment} from "../../models/comment.interface";

@Injectable()
export class EventCommentsProvider{

  commentsRef: any = firebase.database().ref('comments');
  eventsRef: any = firebase.database().ref('events');

  constructor(
    private authService: AuthProvider,
    private af:AngularFireDatabase) {  }


  getEventCommentsRef(eventId: string)  {
    console.log(`getEventCommentsRef::${eventId}`)
    return this.commentsRef.orderByChild('event').equalTo(eventId);
  }

  getCommentsRef() {
    return this.commentsRef;
  }

  submitComment(threadKey: string, comment: IComment) {
    // let commentRef = this.commentsRef.push();
    // let commentkey: string = commentRef.key;
    this.commentsRef.child(comment.key).set(comment);

    return this.eventsRef.child(threadKey + '/comments').once('value')
      .then((snapshot) => {
        let numberOfComments = snapshot == null ? 0 : snapshot.val();
        this.eventsRef.child(threadKey + '/comments').set(numberOfComments + 1);
      });
  }
}
