import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {AuthProvider} from "../auth/auth";

@Injectable()
export class MemberProvider {

  public memberKey: string;
  public isMemberExists: boolean;

  constructor(private af:AngularFireDatabase,
              private authService: AuthProvider,) {
  }

  getMembers(): FirebaseListObservable<any[]> {
    return this.af.list('/members',{
      query: {
        orderByChild: 'firstName'
      }
    });
  }

  updateMember($key: string, firstName, lastName, memberId) {
    let url = `/members/${$key}`;
    let data = this.getMemberJson(firstName, lastName, memberId);
    let memberRef = this.af.object(url);
    memberRef.update(data)
    //.then(_ => console.log('update!'))
    ;
  }

  addMember(firstName, lastName, memberId) {
    let data = this.getMemberJson(firstName, lastName, memberId);

    let url = `/members`;
    let membersRef = this.af.list(url);
    membersRef.push(data);
  }

  private getMemberJson(firstName, lastName, memberId) {
    return {
      firstName: firstName,
      lastName: lastName,
      memberId: memberId
    };
  }

  findMemberId(memberKey: string) {
    console.log('find: '+ memberKey);
    return this.af.list(`/members/`, {
      query: {
        orderByChild: 'memberId',
        equalTo: memberKey,
        limitToFirst: 1
      },
      preserveSnapshot: true
    });
  }

  getMember(memberKey: string) {
    return this.af.object(`/members/${memberKey}`, { preserveSnapshot: true });
  }

  confirmMember(memberKey: string) {
    //console.log('confirm:' + memberKey);
    //TODO: need to add validation that this memberKey is not taken by userKey
    // query the userMember node if a memberKey exists
    const userKey = this.authService.getActiveUser().uid;
    let url = `/userMember/${userKey}/${memberKey}`;
    this.af.object(url).$ref.transaction(currentValue => {
      if (currentValue === null) {
        //return true;
        return{on : new Date().toISOString()};
      } else {
        //console.log('This username is taken. Try another one');
        //return Promise.reject(Error('username is taken'))
      }
    })
      .then( result => {
        // Good to go, user does not exist
        if (result.committed) {
          //console.log('user member assoc created');
          // let voteUrl = `/attendees/${eventKey}/${memberKey}/voteCount`;
          // let tagObs = this.af.database.object(voteUrl);
          // tagObs.$ref.transaction(tagValue => {
          //   return tagValue ? tagValue + 1 : 1;
          // });
        }
      })
      .catch( error => {
        // handle error
      });
  }

  isVerified() {

    const userKey = this.authService.getActiveUser().uid;
    let url = `/userMember/${userKey}`;
    let exists:boolean=false;
    const userMemberRef = this.af.object(url, { preserveSnapshot: true });

    userMemberRef.subscribe(data => {
      if(data.val()==null) {
        exists = false;
      } else {
        exists = true;
      }
    });
    return exists;
  }

  public getMemberKeyByUserKey() {
    const userKey = this.authService.getActiveUser().uid;
    let url = `/userMember/${userKey}`;
    return this.af.object(url, { preserveSnapshot: true });
  }

}
