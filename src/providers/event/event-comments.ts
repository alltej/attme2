
import {Injectable} from "@angular/core";
import {FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/Rx';
import {AuthProvider} from "../auth/auth";

import * as firebase from 'firebase';
import {IComment} from "../../models/comment.interface";
import {DataProvider} from "../data/data";

@Injectable()
export class EventCommentsProvider{

  commentsRef: any = firebase.database().ref('comments');
  eventsRef: any = firebase.database().ref('events');

  constructor(
    private authService: AuthProvider,
    private af:AngularFireDatabase,
    private dataSvc: DataProvider
    ) {  }


  // getEventCommentsRef(ooid: string, eventId: string)  {
  //   //console.log(`getEventCommentsRef::${eventId}`)
  //   //return this.commentsRef.orderByChild('event').equalTo(eventId);
  //   return this.dataSvc.getEventCommentsRef(ooid, eventId).orderByChild('dateCreated')
  // }

  getEventCommentsRef(ooid: string, eventId: string)  {
    //console.log(`getEventCommentsRef::${eventId}`)
    //return this.commentsRef.orderByChild('event').equalTo(eventId);
    return this.dataSvc.getEventCommentsRef(ooid, eventId);//.orderByChild('dateCreated')
  }

  getEvent(eventId: string) {
    return this.eventsRef.child(eventId).once('value');
  }

  getCommentsRef() {
    return this.commentsRef;
  }

  submitComment(ooid: string, eventId: string, comment: IComment) {
    // let commentRef = this.commentsRef.push();
    // let commentkey: string = commentRef.key;
    //console.log(`submitComment::${eventId}`
    this.dataSvc.getEventCommentsRef(ooid, eventId).child(comment.key).set(comment);

    //this.commentsRef.child(comment.key).set(comment);

    return this.dataSvc.getEventsRef(ooid).child(`${eventId}/stats/comments`).once('value')
      .then((snapshot) => {
        let numberOfComments = snapshot == null ? 0 : snapshot.val();
        //console.log(`numberOfComments::${numberOfComments}`)
        this.dataSvc.getEventsRef(ooid).child(`${eventId}/stats/comments`).set(numberOfComments + 1);
      });
  }
}
