import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {MemberProvider} from "../member/member";
import {DataProvider} from "../data/data";

@Injectable()
export class ProfileProvider {
  public currentUser:firebase.User;

  constructor(private dataSvc: DataProvider) {
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        this.currentUser = user;
        //this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  getUserProfileData(uid: string) {
    return this.dataSvc.usersRef.child(`${uid}/profile`).once('value');
  }

  updateName(uid:string, firstName: string, lastName: string): firebase.Promise<void> {
    return this.dataSvc.usersRef.child(`${uid}/profile`).update({
      firstname: firstName,
      lastname: lastName,
      name: firstName + " " + lastName
    });
  }

  updateDOB(uid:string, birthDate: string): firebase.Promise<any> {
    //console.log(`profile::updateDOB::${birthDate}`)
    return this.dataSvc.usersRef.child(`${uid}/profile`).update({
      birthDate: birthDate,
    });
  }

  setUserImage(uid: string, url: string) {
    return this.dataSvc.usersRef.child(`${uid}/profile`).update({
      image: true,
      photoUrl: url
    });
  }

  updatePassword(newPassword: string, oldPassword: string): firebase.Promise<any> {
    const credential =  firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, oldPassword);

    return this.currentUser.reauthenticateWithCredential(credential).then( user => {
      this.currentUser.updatePassword(newPassword).then( user => {
        //console.log("Password Changed");
      }, error => {
        //console.log(error);
      });
    });
  }
}
