import 'rxjs/add/operator/map';
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthProvider} from "../auth/auth";
import {Subscription} from "rxjs/Subscription";
import {UserData} from "../data/user-data";


@Injectable()
export class UserCircleProvider {

  userId:string;
  public circlesSub: Subscription;
  private ooid: string;
  private aoid: string;
  constructor(private af:AngularFireDatabase,
              private authService:AuthProvider,
              private userData: UserData) {
    this.userId = this.authService.getLoggedInUser().uid;
    this.ooid = this.userData.getCurrentOOID();
    //this.ooid = this.userData.getSelectedOrganization();
    //this.aoid = this.userData.getSelectOrgMemberKey();
  }

  addToMyCircle(memberKey:string){
    const userId = this.authService.getLoggedInUser().uid;
    let afRef = this.af.object(`/users/${this.authService.getLoggedInUser().uid}/circles/${this.ooid}/members/${memberKey}`)
    afRef.set(true);
  }

  getMyCircles1(){
    let circleKeys = [];
    this.circlesSub = this.af
      .list(`/users/${this.authService.getLoggedInUser().uid}/circles/${this.ooid}/members`, { preserveSnapshot: true})
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
