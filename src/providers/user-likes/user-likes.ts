import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase} from "angularfire2/database";
import {AuthProvider} from "../auth/auth";
import {ProfileProvider} from "../profile/profile";
import {DataProvider} from "../data/data";

@Injectable()
export class UserLikesProvider {
  //private currentUid: string;

  constructor(private af:AngularFireDatabase,
              private authSvc:AuthProvider,
              private dataSvc:DataProvider,
              private profileSvc:ProfileProvider,
              ) {
    // if (this.authSvc.getLoggedInUser() != null) {
    //   this.currentUid = this.authSvc.getLoggedInUser().uid;
    // }
  }

  addLike(ooid: string, eventKey: string) {
    //let currentUid = this.authSvc.getLoggedInUser().uid;
    this.af.object(`/users/${this.authSvc.getLoggedInUser().uid}/likes/${ooid}/${eventKey}`)
      .$ref.transaction(currentValue => {
      if (currentValue === null) {
        return{on : new Date().toISOString()};
      }
    })
      .then( result => {
        if (result.committed) {
          let un = "";
          this.dataSvc.usersRef
            .child(`${this.authSvc.getLoggedInUser().uid}/profile`)
            .once('value')
            .then( userProfileValue => {
              un =  userProfileValue.val().lastname + " " + userProfileValue.val().firstname.charAt(0)
          }).then(sf => {
            this.af.object(`/organizations/${ooid}/events/${eventKey}/likedBy/${this.authSvc.getLoggedInUser().uid}`)
              .$ref.transaction(currentValue => {
              if (currentValue === null) {
                return{
                  on : new Date().toISOString(),
                  name: un
                };
              }
            }).then(data => {
              if (data.committed) {
                let tagObs = this.af.object(`/organizations/${ooid}/events/${eventKey}/stats/likes`);
                tagObs.$ref.transaction(tagValue => {
                  return tagValue ? tagValue + 1 : 1;
                });
              }
            })
          })
        }
      })
      .catch( error => {
        // handle error
      });
  }

  removeLike(ooid: string, eventKey: string) {
    let likeCountRef = this.af.object(`/organizations/${ooid}/events/${eventKey}/stats/likes`);
    let likeCount = 0;
    likeCountRef.$ref.transaction(tagValue => {
      likeCount = tagValue ? tagValue - 1 : 0;
      return likeCount;
    }).then(result => {
      if (result.committed) {
        this.af.object(`/organizations/${ooid}/events/${eventKey}/likedBy/${this.authSvc.getLoggedInUser().uid}`).remove()
        this.af.object(`/users/${this.authSvc.getLoggedInUser().uid}/likes/${ooid}/${eventKey}`).remove();
        if (likeCount == 0){
          likeCountRef.remove();
        }
      }
    });
  }

  isLiked(ooid: string, eventKey: string) {
    return this.af.object(`/users/${this.authSvc.getLoggedInUser().uid}/likes/${ooid}/${eventKey}`);
  }
}
