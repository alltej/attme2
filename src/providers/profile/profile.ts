import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {MemberProvider} from "../member/member";

@Injectable()
export class ProfileProvider {
  public userProfile:firebase.database.Reference;
  public currentUser:firebase.User;

  constructor(private memberSvc: MemberProvider) {
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  getUsers(): firebase.database.Reference {
    return firebase.database().ref(`/userProfile`);
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  updateName(firstName: string, lastName: string): firebase.Promise<void> {
    return this.userProfile.update({
      firstName: firstName,
      lastName: lastName,
    });
  }

  updateDOB(birthDate: string): firebase.Promise<any> {
    return this.userProfile.update({
      birthDate: birthDate,
    });
  }

  updateEmail(newEmail: string, password: string): firebase.Promise<any> {
    const credential =  firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, password);

    return this.currentUser.reauthenticateWithCredential(credential).then( user => {
      this.currentUser.updateEmail(newEmail).then( user => {
        this.userProfile.update({ email: newEmail });
      });
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

  updateimage(imageUrl) {
    var promise = new Promise((resolve, reject) => {
      this.currentUser.updateProfile({
        displayName: this.currentUser.displayName,
        photoURL: imageUrl
      }).then(() => {
        this.userProfile.update({
          displayName: this.currentUser.displayName,
          photoURL: imageUrl,
          //uid: this.currentUser.uid
        }).then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err);
        })
      }).then( () =>{
          this.memberSvc.updatePhotoUrl(this.currentUser.uid, imageUrl);
        })
        .catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

}
