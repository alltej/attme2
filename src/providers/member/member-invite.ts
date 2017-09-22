import { Injectable } from '@angular/core';
import {firebaseConfig} from "../../config/firebase.config";
import * as firebase from 'firebase';

@Injectable()
export class MemberInviteProvider {

  private fireAuth:firebase.auth.Auth;
  private userProfileRef:firebase.database.Reference;

  constructor() {
    let secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
    this.fireAuth = secondaryApp.auth();
    this.userProfileRef = secondaryApp.database().ref('/userProfile');

  }

  createUserInvite(memberKey:string,lastName:string, firstName:string, email:string){
    this.fireAuth.createUserWithEmailAndPassword(email, 'Welcome.1')
      .then(
        (newUser) => {
          this.userProfileRef.child(newUser.uid).set({
            memberKey:memberKey,
            lastName:lastName,
            firstName:firstName,
            email: email
          });

          //let user:any = firebase.auth().currentUser;
          let user:any = newUser;
          //console.log(`User Created::${user}`);
          user.sendEmailVerification().then(
            (success) => {
              //console.log("please verify your email")
            }
          ).catch(
            (err) => {
              //this.error = err;
              //console.log('errA');
              //console.log(err);
            }
          )
        }
      )
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = 'uth/weak-password';
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        //console.log(error);
      })
  }

}
