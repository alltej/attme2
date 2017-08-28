
import {Injectable} from "@angular/core";
import {FirebaseListObservable, AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/Rx';
import {AuthProvider} from "../auth/auth";

export class vote {
  constructor(
    public on: Date) {}
}

@Injectable()
export class AttendanceProvider{

  constructor(
    private authService: AuthProvider,
    private af:AngularFireDatabase) {  }

  getAttendees(eventId: string): FirebaseListObservable<any[]> {
    return this.af.list(`/attendees/${eventId}`);
  }

  addAttendee(eventKey: string, memberKey:string) {
    const userId = this.authService.getActiveUser().uid;
    let url = `/attendees/${eventKey}/${memberKey}/votes/${userId}`;
    this.af.object(url).$ref.transaction(currentValue => {
      if (currentValue === null) {
        return{on : new Date().toISOString()};
      } else {
        //console.log('This username is taken. Try another one');
        //return Promise.reject(Error('username is taken'))
      }
    })
      .then( result => {
        // Good to go, user does not exist
        if (result.committed) {
          let voteUrl = `/attendees/${eventKey}/${memberKey}/voteCount`;
          let tagObs = this.af.object(voteUrl);
          tagObs.$ref.transaction(tagValue => {
            return tagValue ? tagValue + 1 : 1;
          });
        }
      })
      .catch( error => {
        // handle error
      });
  }

  isVoted(eventKey:string, memberKey:string) {
    const userKey = this.authService.getActiveUser().uid;
    let url = `/attendees/${eventKey}/${memberKey}/votes/${userKey}`;
    let voted = false;
    const eventMemberVoteRef = this.af.object(url, { preserveSnapshot: true });

    eventMemberVoteRef.subscribe(data => {
      if(data.val()==null) {
        voted = false;
      } else {
        voted = true;
      }
    });
    return voted;
  }

  removeAttendee(eventKey: string, memberKey: string) {
    const userId = this.authService.getActiveUser().uid;
    let voteKeyUserUrl = `/attendees/${eventKey}/${memberKey}/votes/${userId}`;
    const voteUserKeyRef = this.af.object(voteKeyUserUrl);
    voteUserKeyRef.remove();

    let voteCountUrl = `/attendees/${eventKey}/${memberKey}/voteCount`;
    let voteCountRef = this.af.object(voteCountUrl);
    let voteCount = 0;
    voteCountRef.$ref.transaction(tagValue => {
      voteCount = tagValue ? tagValue - 1 : 0;
      return voteCount;
    }).then(result => {
        if (result.committed) {
          if (voteCount == 0){
            let eventMemberKeyUrl = `/attendees/${eventKey}/${memberKey}`;
            this.af.object(eventMemberKeyUrl).remove();
          }
        }
    });
  }

  getUpVotes(eventKey: string, memberKey: string) {
    let voteCount = 0;
    let voteCountUrl = `/attendees/${eventKey}/${memberKey}/voteCount`;
    var voteCountRef = this.af.object(voteCountUrl,{ preserveSnapshot: true})

    voteCountRef.subscribe(snapshot => {
      voteCount = snapshot.val();
    });
    return voteCount;
  }
}
