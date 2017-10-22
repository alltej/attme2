import { Injectable } from '@angular/core';
import {firebaseConfig} from "../../config/firebase.config";
import * as firebase from 'firebase';
import {IMember} from "../../models/member.interface";

@Injectable()
export class MemberInviteProvider {

  private fireAuth:firebase.auth.Auth;
  private userProfileRef:firebase.database.Reference;

  constructor() {
    let secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
    this.fireAuth = secondaryApp.auth();
    this.userProfileRef = secondaryApp.database().ref('/users');

  }

  createUserInvite(ooid:string, orgName: string, member: IMember){
    this.fireAuth.createUserWithEmailAndPassword(member.email, 'Welcome.1')
      .then(
        (newUser) => {
          this.userProfileRef.child(newUser.uid)
            .child("profile").set({
              lastName:member.lastname,
              firstName:member.firstname,
              email: member.email,
              organizations : {
                  ooid : {name: orgName, role: 1}
              },
              verified: false
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
