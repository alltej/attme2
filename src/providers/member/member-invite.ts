import { Injectable } from '@angular/core';
import {firebaseConfig} from "../../config/firebase.config";
import * as firebase from 'firebase';
import {IMember} from "../../models/member.interface";
import {DataProvider} from "../data/data";

@Injectable()
export class MemberInviteProvider {

  private fireAuth:firebase.auth.Auth;
  //private userProfileRef:firebase.database.Reference;

  constructor(private dataSvc: DataProvider) {
    let secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
    this.fireAuth = secondaryApp.auth();
    //this.userProfileRef = secondaryApp.database().ref('/users');

  }

  createUserInvite(ooid:string, orgName: string, roleId: number, member: IMember){
    this.fireAuth.createUserWithEmailAndPassword(member.email, 'Welcome.1')
      .then(
        (newUser) => {
          this.dataSvc.userInvitesRef.child(newUser.uid).set({
              lastname:member.lastname,
              firstname:member.firstname,
              email: member.email,
              ooid: ooid,
              ooName: orgName,
              role: roleId
          }).then(()=>{
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
          });
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
