import 'rxjs/add/operator/map';
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthProvider} from "../auth/auth";
import {Subscription} from "rxjs/Subscription";


@Injectable()
export class UserCircleProvider {

  userId:string;
  public circlesSub: Subscription;
  constructor(private af:AngularFireDatabase,
              private authService:AuthProvider) {
    this.userId = this.authService.getActiveUser().uid;
  }

  // getUserCircles(): FirebaseListObservable<any[]> {
  //   return this.af.database.list('/events', {
  //     query: {
  //       limitToLast: 20,
  //       orderByChild: 'when',
  //       startAt: this.startAtFilter,
  //     }})
  // }

  addToMyCircle(memberKey:string){
    const userId = this.authService.getActiveUser().uid;
    let url = `/userCircles/${userId}/${memberKey}`;
    let afRef = this.af.object(url);
    afRef.set(true);
  }

  getMyCircles(){
    //console.log('UserCircles.getMyCircles')
    let circleKeys = [];
    const userKey = this.authService.getActiveUser().uid;
    let url = `/userCircles/${userKey}`;
    return this.af.list(url, { preserveSnapshot: true});
  }

  getMyCircles1(){
    //console.log('UserCircles.getMyCircles')
    let circleKeys = [];
    const userKey = this.authService.getActiveUser().uid;
    let url = `/userCircles/${userKey}`;
    this.circlesSub = this.af.list(url, { preserveSnapshot: true})
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
    //const userId = this.authService.getActiveUser().uid;
    //console.log('isMyCircle::' + memberKey);
    let url = `/userCircles/${this.userId}/${memberKey}`;
    //return this.af.object(url, { preserveSnapshot: true });
    return this.af.object(url);

  }
  isMyCircle1(memberKey: string) {
    //const userId = this.authService.getActiveUser().uid;
    //console.log('isMyCircle::' + memberKey);
    let url = `/userCircles/${this.userId}/${memberKey}`;
    let circleRef = this.af.object(url, { preserveSnapshot: true });
    //console.log(circleRef);
    //return circleRef;
    let isSelected = false;
    circleRef.subscribe(data => {
      if(data.val()==null) {
        isSelected = false;
      } else {
        isSelected = true;
      }
    });
    return isSelected;
  }

  removeFromMyCircle(memberKey: string) {
    let url = `/userCircles/${this.userId}/${memberKey}`;
    //let afRef = this.af.database.object(url);
    this.af.object(url).remove();
  }

}
