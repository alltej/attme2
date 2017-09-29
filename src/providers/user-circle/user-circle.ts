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
    this.userId = this.authService.getLoggedInUser().uid;
  }

  addToMyCircle(memberKey:string){
    const userId = this.authService.getLoggedInUser().uid;
    let afRef = this.af.object(`/userCircles/${userId}/${memberKey}`)
    afRef.set(true);
  }

  getMyCircles1(){
    let circleKeys = [];
    this.circlesSub = this.af
      .list(`/userCircles/${this.authService.getLoggedInUser().uid}`, { preserveSnapshot: true})
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
    return this.af.object(`/userCircles/${this.userId}/${memberKey}`);

  }

  removeFromMyCircle(memberKey: string) {
    let url = `/userCircles/${this.userId}/${memberKey}`;
    //let afRef = this.af.database.object(url);
    this.af.object(url).remove();
  }

}
