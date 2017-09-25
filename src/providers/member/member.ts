import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AuthProvider} from "../auth/auth";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class MemberProvider {

  public memberKey: string;
  public isMemberExists: boolean;
  private membersWithVoteCount: Observable<any>;
  public eventAttendeeVoteCount: Subscription;

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

  // getUpVotes1(eventKey: string, memberKey: string) {
  //   console.log('xxx')
  //   //return this.af.object(`/attendees/${eventKey}/members/${memberKey}`,{ preserveSnapshot: false})
  //   return this.af.object(`/attendees/${eventKey}/members/${memberKey}`);
  // }


  getMembersForEvent(eventKey: string): FirebaseListObservable<any[]> {
    return  this.af.list('/members',{
      query: {
        orderByChild: 'firstName'
      }
    });
  }

  getMembersWithVoteCountO(eventKey: string): Observable<any[]> {
    this.membersWithVoteCount =  this.af.list('/members',{
      query: {
        orderByChild: 'firstName'
      }
    })
      .map(members =>{
        members.map(member =>{
          this.eventAttendeeVoteCount = this.af.object(`/attendees/${eventKey}/members/${member.$key}`)
            .subscribe(vote =>{
              member.voteCount = vote.voteCount;
              this.eventAttendeeVoteCount.unsubscribe();
            })
          return member;
        })
        return members;
      });
    return this.membersWithVoteCount;
  }

  // getMembersWithUsername(eventKey: string): Observable<any[]> {
  //   let members =  this.af.list('/members',{
  //     query: {
  //       orderByChild: 'firstName'
  //     }
  //   })
  //     .map(members =>{
  //       members.map(member =>{
  //         this.af.object(`/userProfile}/members/${member.$key}`)
  //           .subscribe(profile =>{
  //             member.userName = profile.userName;
  //           })
  //         return member;
  //       })
  //       return members;
  //     });
  //   return members;
  // }

  updateMember($key: string, firstName, lastName, memberId,email) {
    let url = `/members/${$key}`;
    let data = this.getMemberJson(firstName, lastName, memberId, email);
    let memberRef = this.af.object(url);
    memberRef.update(data)
    //.then(_ => console.log('update!'))
    ;
  }

  addMember(firstName, lastName, memberId, email) {
    let data = this.getMemberJson(firstName, lastName, memberId, email);

    let url = `/members`;
    let membersRef = this.af.list(url);
    membersRef.push(data);
  }

  updateName(memberKey: string, firstName, lastName): firebase.Promise<void> {
    let url = `/members/${memberKey}`;
    return this.af.object(url).update({
      firstName: firstName,
      lastName: lastName,
    });
  }

  updatePhotoUrl(memberKey: string, photoUrl:string): firebase.Promise<void> {
    let url = `/members/${memberKey}`;
    return this.af.object(url).update({
      photoUrl: photoUrl
    });
  }

  private getMemberJson(firstName, lastName, memberId, email) {
    return {
      firstName: firstName,
      lastName: lastName,
      memberId: memberId,
      email: email
    };
  }

  findMemberId(memberKey: string) {
    //console.log('find: '+ memberKey);
    return this.af.list(`/userProfile/`, {
      query: {
        orderByChild: 'memberKey',
        equalTo: memberKey,
        limitToFirst: 1
      }
    });
  }

  getMember(memberKey: string):FirebaseObjectObservable<any> {
    //return this.af.object(`/members/${memberKey}`, { preserveSnapshot: true });
    return this.af.object(`/members/${memberKey}`);
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

  updateEmail(memberKey: string, newEmail: string) {
    //console.log(`U THERE?${memberKey}, ${newEmail}`);
    let url = `/members/${memberKey}`;
    return this.af.object(url).update({
      email: newEmail
    });
  }

  updateMemberId(memberKey: string, memberId: string): firebase.Promise<void> {
    //console.log(`U THERE?${memberKey}, ${memberId}`);
    let url = `/members/${memberKey}`;
    return this.af.object(url).update({
      memberId: memberId
    });
  }
}
