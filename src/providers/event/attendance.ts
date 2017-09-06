
import {Injectable} from "@angular/core";
import {FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/Rx';
import {AuthProvider} from "../auth/auth";

@Injectable()
export class AttendanceProvider{

  constructor(
    private authService: AuthProvider,
    private af:AngularFireDatabase) {  }

  getAttendees(eventId: string): FirebaseListObservable<any[]> {
    return this.af.list(`/attendees/${eventId}`);
  }

  addAttendee(eventKey: string, memberKey:string) {
    console.log('addAttendee')
    const userId = this.authService.getActiveUser().uid;

    this.af.object(`/attendees/${eventKey}/members/${memberKey}`).$ref.transaction(currentValue => {
      if (currentValue === null) {
        //console.log('aaa-11::this is new member key');
        return{voteCount : 0};
      } else {
        //console.log('This member already exists. do not increment counter');
        //return Promise.reject(Error('username is taken'))
      }
    }).then(
      result0 =>{

        this.af.object(`/attendees/${eventKey}/members/${memberKey}/votes/${userId}`).$ref.transaction(currentValue => {
          if (currentValue === null) {
            return{on : new Date().toISOString()};
          }
        })
          .then( result1 => {
            let ac = 0;
            let mc = 0;
            // Good to go, user does not exist
            if (result1.committed) {
              this.af.object(`/attendees/${eventKey}/members/${memberKey}/voteCount`).$ref.transaction(tagValue => {
                mc = tagValue ? tagValue + 1 : 1;
                return mc;
              })

              if (result0.committed) {
                //console.log(`is new member therefore increment counter`)
                this.af.object(`/attendees/${eventKey}/attendeesCount`).$ref.transaction(tagValue => {
                  ac = tagValue ? tagValue + 1 : 1;
                  return ac;
                }).then(result =>{
                  if (result.committed) {
                    this.af.object(`/events/${eventKey}/attendeesCount`).$ref.transaction(() => {
                      return ac;
                    });
                  }
                })
              }
            }
          })
          .catch( error => {
            // handle error
          });

      }
    )

  }

  isVoted(eventKey:string, memberKey:string) {
    const userKey = this.authService.getActiveUser().uid;
    let voted = false;
    //return this.af.object(`/attendees/${eventKey}/members/${memberKey}/votes/${userKey}`, { preserveSnapshot: true });
    return this.af.object(`/attendees/${eventKey}/members/${memberKey}/votes/${userKey}`);

  }

  isVotedO(eventKey:string, memberKey:string) {
    const userKey = this.authService.getActiveUser().uid;
    let voted = false;
    const eventMemberVoteRef = this.af.object(`/attendees/${eventKey}/members/${memberKey}/votes/${userKey}`, { preserveSnapshot: true });

    eventMemberVoteRef
      .subscribe(data => {
        if(data.val()==null) {
          voted = false;
        } else {
          voted = true;
        }
    });
    return voted;
  }

  removeAttendee(eventKey: string, memberKey: string) {
    //console.log('removeAttendee')
    const userId = this.authService.getActiveUser().uid;

    let voteCount = 0;
    this.af.object(`/attendees/${eventKey}/members/${memberKey}/voteCount`).$ref.transaction(tagValue => {
      voteCount = tagValue ? tagValue - 1 : 0;
      return voteCount;
    }).then(result1 => {
      if (result1.committed) {
        //console.log('result1.committed')
        this.af.object(`/attendees/${eventKey}/members/${memberKey}/votes/${userId}`).remove()

        if (voteCount == 0){
          let eventMemberKeyUrl = `/attendees/${eventKey}/members/${memberKey}`;
          this.af.object(eventMemberKeyUrl).remove();

          let ac = 0;
          this.af.object(`/attendees/${eventKey}/attendeesCount`).$ref.transaction(tagValue => {
            ac = tagValue ? tagValue - 1 : 0;
            return ac;
          }).then(
            result =>{
              this.af.object(`/events/${eventKey}/attendeesCount`).$ref.transaction(tagValue => {
                return ac;
              });
            }
          )
        }
      }
    });
  }

  getMemberVoteCount(eventKey: string, memberKey: string) {
    return this.af.object(`/attendees/${eventKey}/members/${memberKey}`);
  }

  getUpVotes(eventKey: string, memberKey: string) {
    let voteCount = 0;
    let voteCountUrl = `/attendees/${eventKey}/members/${memberKey}/voteCount`;
    var voteCountRef = this.af.object(voteCountUrl,{ preserveSnapshot: true})

    voteCountRef.subscribe(snapshot => {
      voteCount = snapshot.val();
    });
    return voteCount;
  }


  // isLiked(eventKey: string) {
  //   let liked:boolean = false;
  //   let url = `/userLikes/${this.authSvc.getActiveUser().uid}/${eventKey}`;
  //
  //   //return this.af.object(url, { preserveSnapshot: true });
  //   return this.af.object(url);
  // }
}
