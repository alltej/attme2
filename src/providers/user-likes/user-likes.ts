import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase} from "angularfire2/database";
import {AuthProvider} from "../auth/auth";
import {ProfileProvider} from "../profile/profile";

@Injectable()
export class UserLikesProvider {

  constructor(private af:AngularFireDatabase,
              private authSvc:AuthProvider,
              private profileSvc:ProfileProvider,
              ) {
  }

  addLike(eventKey: string) {
    let currentUid = this.authSvc.getActiveUser().uid;
    let url = `/userLikes/${currentUid}/${eventKey}`;
    this.af.object(url).$ref.transaction(currentValue => {
      if (currentValue === null) {
        return{on : new Date().toISOString()};
      }
    })
      .then( result => {
        if (result.committed) {
          //console.log(this.authSvc.getActiveUser().lastName)
          let un = "";
          this.profileSvc.getUserProfile().once('value').then( userProfileValue => {
            un =  userProfileValue.val().lastName + " " + userProfileValue.val().firstName.charAt(0)
          }).then(sf => {
            this.af.object(`/events/${eventKey}/likedBy/${currentUid}`).$ref.transaction(currentValue => {
              if (currentValue === null) {
                return{
                  on : new Date().toISOString(),
                  name: un
                };
              }
            }).then(data => {
              if (data.committed) {
                //console.log(data)
                let tagObs = this.af.object(`/events/${eventKey}/likes`);
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

  removeLike(eventKey: string) {
    let likeCountRef = this.af.object(`/events/${eventKey}/likes`);
    let likeCount = 0;
    likeCountRef.$ref.transaction(tagValue => {
      likeCount = tagValue ? tagValue - 1 : 0;
      // if (likeCount == 0) {
      //   likeCountRef.remove();
      // }
      return likeCount;
    }).then(result => {
      if (result.committed) {
        let currentUid = this.authSvc.getActiveUser().uid;
        this.af.object(`/events/${eventKey}/likedBy/${currentUid}`).remove()

        //console.log(`removeEventLike::${url}`);
        this.af.object(`/userLikes/${currentUid}/${eventKey}`).remove();
        if (likeCount == 0){
          likeCountRef.remove();
        }
      }
    });
  }

  isLiked(eventKey: string) {
    let liked:boolean = false;
    let url = `/userLikes/${this.authSvc.getActiveUser().uid}/${eventKey}`;

    //return this.af.object(url, { preserveSnapshot: true });
    //return this.af.object(url, { preserveSnapshot: true });
    return this.af.object(url);
  }

  isLikedO(eventKey: string) {
    let liked:boolean = false;
    let url = `/userLikes/${this.authSvc.getActiveUser().uid}/${eventKey}`;

    //return this.af.object(url, { preserveSnapshot: true });
    return this.af.object(url);
  }

  isLiked1(eventKey: string) {
    let liked:boolean = false;
    let url = `/userLikes/${this.authSvc.getActiveUser().uid}/${eventKey}`;

    //return this.af.object(url, { preserveSnapshot: true });
    return this.af.object(url, { preserveSnapshot: false });

    // const likedRef = this.af.object(url, { preserveSnapshot: true });
    //
    // likedRef.subscribe(data => {
    //   if(data.val()==null) {
    //     liked = false;
    //   } else {
    //     liked = true;
    //   }
    // });
    //
    // return liked;
    // let liked = false;
    // const likedRef = this.af.object(url, { preserveSnapshot: true });
    //
    // likedRef.subscribe(data => {
    //   if(data.val()==null) {
    //     liked = false;
    //   } else {
    //     liked = true;
    //   }
    // });
    //
    // return liked;
  }
}
