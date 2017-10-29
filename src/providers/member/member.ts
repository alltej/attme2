import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AuthProvider} from "../auth/auth";
import firebase from 'firebase';
import {INewMember} from "../../models/member.interface";
import {DataProvider} from "../data/data";
import {UserData} from "../data/user-data";
import {IInvite} from "../../models/invite.interface";

@Injectable()
export class MemberProvider {

  public memberKey: string;

  constructor(private af:AngularFireDatabase,
              private authService: AuthProvider,
              private dataSvc: DataProvider,
              private userData: UserData) {
  }

  getMembersForEvent(): FirebaseListObservable<any[]> {
    return  this.af.list(`/organizations/${this.userData.currentOOId}/members`,{
      query: {
        orderByChild: 'firstname'
      }
    });
  }

  getMembersRx(): FirebaseListObservable<any[]> {
    return  this.af.list(`/organizations/${this.userData.currentOOId}/members`,{
      query: {
        orderByChild: 'firstname'
      }
    });
  }

  createMember3(newMember: INewMember): firebase.Promise<any> {
    try {
      this.dataSvc.getOrgsRef().child(`${this.userData.currentOOId}/members`).child(newMember.memberKey).set(newMember);

      return this.dataSvc.getOrgsRef().child(`${this.userData.currentOOId}/stats/members`).once('value')
        .then((snapshot) => {
          let count = snapshot == null ? 0 : snapshot.val();
          this.dataSvc.getOrgsRef().child(`${this.userData.currentOOId}/stats/members`).set(count + 1);
        });
    } catch (e) {
      //console.log(e)
    }
  }

  createInvite(anInvite: IInvite, memberKey: string) : firebase.Promise<any> {
    try {
      return this.dataSvc.getInvitesRef().child(anInvite.inviteKey)
        .set(anInvite);
    } catch (e) {
      //console.log(e)
    }
  }

  updateName(memberKey: string, firstName, lastName): firebase.Promise<void> {
    return this.dataSvc.getOrgsRef()
      .child(this.userData.currentOOId)
      .child(`/members/${memberKey}`)
      .update({
        firstname: firstName,
        lastname: lastName,
    });
  }

  setIsInvited(memberKey: string): firebase.Promise<void> {
    console.log('setIsInvited')
    return this.dataSvc.getOrgsRef()
      .child(this.userData.currentOOId)
      .child(`/members/${memberKey}`)
      .update({
        invited: true
      });
  }

  updatePhotoUrl(memberKey: string, photoUrl:string): firebase.Promise<void> {
    return this.dataSvc.getOrgsRef()
      .child(`${this.userData.currentOOId}/members/${memberKey}`)
      .update({
        photoUrl: photoUrl
      });
  }

  confirmMember(memberKey: string) {
    //console.log('confirm:' + memberKey);
    //TODO: need to add validation that this memberKey is not taken by userKey
    // query the userMember node if a memberKey exists
    const userKey = this.authService.getLoggedInUser().uid;
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

  updateEmail(memberKey: string, newEmail: string): firebase.Promise<void> {
    return this.dataSvc.getOrgsRef()
      .child(this.userData.currentOOId)
      .child(`/members/${memberKey}`)
      .update({
        email: newEmail
      });
  }

  updateMemberId(memberKey: string, memberId: string): firebase.Promise<void> {
    return this.dataSvc.getOrgsRef()
      .child(this.userData.currentOOId)
      .child(`/members/${memberKey}`)
      .update({
        memberId: memberId
      });
  }

  updateDOB(memberKey: string, birthDate: Date): firebase.Promise<void> {
    //console.log(`updateDOB::ooid==${ooid};;${memberKey}::${birthDate}`)
    return this.dataSvc.getOrgsRef()
      .child(this.userData.currentOOId)
      .child(`/members/${memberKey}`)
      .update({
        birthDate: birthDate
      });
  }

  getMemberData2(memberKey: string) {
    //console.log(`getMemberData2::ooid=${memberKey}::memberKey=${memberKey}`);
    return this.dataSvc.getOrgsRef().child(`/${this.userData.currentOOId}/members/${memberKey}`).once('value');
  }
}
