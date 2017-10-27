import 'rxjs/add/operator/map';
import {Injectable, OnInit} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AuthProvider} from "../auth/auth";
import {Subscription} from "rxjs/Subscription";
import {UserData} from "../data/user-data";


@Injectable()
export class UserCircleProvider{

  public circlesSub: Subscription;
  constructor(private af:AngularFireDatabase,
              private authService:AuthProvider,
              private userData: UserData) {
  }

  addToMyCircle(memberKey:string){
    let afRef = this.af.object(`/users/${this.authService.getLoggedInUser().uid}/circles/${this.userData.currentOOId}/members/${memberKey}`)
    afRef.set(true);
  }

  getMyCircles1(){
    let circleKeys = [];
    this.circlesSub = this.af
      .list(`/users/${this.authService.getLoggedInUser().uid}/circles/${this.userData.currentOOId}/members`, { preserveSnapshot: true})
      .take(1)
      .subscribe(itemKeys=>{
        itemKeys.forEach(itemKey => {
          circleKeys.push(itemKey.key);
        });
      })
    return circleKeys;
  }

  getMyCirclesRx(): FirebaseListObservable<any[]>{
    if (this.userData.currentOOId == null) return
    return this.af
      .list(`/users/${this.authService.getLoggedInUser().uid}/circles/${this.userData.currentOOId}/members`);
  }

  isMyCircle(memberKey: string) {
    return this.af.object(`/users/${this.authService.getLoggedInUser().uid}/circles/${this.userData.currentOOId}/members/${memberKey}`);
  }

  removeFromMyCircle(memberKey: string) {
    this.af.object(`/users/${this.authService.getLoggedInUser().uid}/circles/${this.userData.currentOOId}/members/${memberKey}`)
      .remove();
  }

}
