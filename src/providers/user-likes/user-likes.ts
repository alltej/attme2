import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase} from "angularfire2/database";
import {AuthProvider} from "../auth/auth";

@Injectable()
export class UserLikesProvider {

  constructor(private af:AngularFireDatabase,
              private authSvc:AuthProvider) {
  }

  addLike(eventKey: string) {
    let url = `/userLikes/${this.authSvc.getActiveUser().uid}/${eventKey}`;
    this.af.object(url).$ref.transaction(currentValue => {
      if (currentValue === null) {
        return{on : new Date().toISOString()};
      }
    })
      .then( result => {
        if (result.committed) {
          let voteUrl = `/events/${eventKey}/likes`;
          let tagObs = this.af.object(voteUrl);
          tagObs.$ref.transaction(tagValue => {
            return tagValue ? tagValue + 1 : 1;
          });
        }
      })
      .catch( error => {
        // handle error
      });
  }

  removeLike(eventKey: string) {
    let countUrl = `/events/${eventKey}/likes`;
    let likeCountRef = this.af.object(countUrl);
    let likeCount = 0;
    likeCountRef.$ref.transaction(tagValue => {
      likeCount = tagValue ? tagValue - 1 : 0;
      return likeCount;
    }).then(result => {
      if (result.committed) {
        if (likeCount == 0){
          let url = `/userLikes/${this.authSvc.getActiveUser().uid}/${eventKey}`;
          this.af.object(url).remove();
        }
      }
    });
  }

  isLiked(eventKey: string) {
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
