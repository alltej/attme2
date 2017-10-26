import 'rxjs/add/operator/map';
import {Injectable, OnInit} from "@angular/core";
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthProvider} from "../auth/auth";
import {Subscription} from "rxjs/Subscription";
import {UserData} from "../data/user-data";


@Injectable()
export class UserCircleProvider{

  userId:string;
  public circlesSub: Subscription;
  //private ooid: string;
  constructor(private af:AngularFireDatabase,
              private authService:AuthProvider,
              private userData: UserData) {
    this.userId = this.authService.getLoggedInUser().uid;
    // this.userData.getCurrentOOID().then(oid=>{
    //   this.ooid = oid;
    // })
  }

  addToMyCircle(memberKey:string){
    let afRef = this.af.object(`/users/${this.userId}/circles/${this.userData.currentOOId}/members/${memberKey}`)
    afRef.set(true);
  }

  getMyCircles1(){
    let circleKeys = [];
    this.circlesSub = this.af
      .list(`/users/${this.userId}/circles/${this.userData.currentOOId}/members`, { preserveSnapshot: true})
      .take(1)
      .subscribe(itemKeys=>{
        itemKeys.forEach(itemKey => {
          //console.log(itemKey.key);
          circleKeys.push(itemKey.key);
        });
      })
    return circleKeys;
  }

  isMyCircle(memberKey: string) {
    return this.af.object(`/users/${this.userId}/circles/${this.userData.currentOOId}/members/${memberKey}`);

  }

  removeFromMyCircle(memberKey: string) {
    this.af.object(`/users/${this.userId}/circles/${this.userData.currentOOId}/members/${memberKey}`)
      .remove();
  }

}
