import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';

// Do not import from 'firebase' as you'd lose the tree shaking benefits
//import * as firebase from 'firebase/app';
import * as firebase from 'firebase';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthProvider {
  public fireAuth:firebase.auth.Auth;
  public userProfileRef:firebase.database.Reference;

  private authState: Observable<firebase.User>
  private currentUser: firebase.User = null;

  constructor(public afAuth: AngularFireAuth) {
    this.fireAuth = firebase.auth();
    this.userProfileRef = firebase.database().ref('/userProfile');

    this.authState = this.afAuth.authState;

    this.authState.subscribe(user => {
      if (user) {
        //console.log(`DEBUG::AuthProvider::User::${user}`)
        this.currentUser = user;
      } else {
        //console.log(`DEBUG::AuthProvider::User::Is NULL!!!!`)
        this.currentUser = null;
      }
    });
  }

  loginUser(email: string, password: string): firebase.Promise<any> {
    //console.log('AuthProvider::login!!!')
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then( newUser => {
      this.userProfileRef.child(newUser.uid).set({
        email: email
      });
    });
  }

  resetPassword(email: string): firebase.Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<void> {
    this.userProfileRef.child(this.afAuth.auth.currentUser.uid).off();

    return this.afAuth.auth.signOut();
  }

  getLoggedInUser() {
    return firebase.auth().currentUser;
  }

  createUserInvite(memberKey:string,lastName:string, firstName:string, email:string) {
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
    // this.fireAuth.createUserWithEmailAndPassword({
    //   email: email,
    //   password: '$Testpswd.1'
    // }).then(
    //   (success) => {
    //     let user:any = firebase.auth().currentUser;
    //     user.sendEmailVerification().then(
    //       (success) => {console.log("please verify your email")}
    //     ).catch(
    //       (err) => {
    //         this.error = err;
    //       }
    //     )
    //
    //   }).catch(
    //   (err) => {
    //     this.error = err;
    //   })
  }

  getUsername(uid: string) {

  }
}
