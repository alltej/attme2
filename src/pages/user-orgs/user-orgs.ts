import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {IUserOrgs} from "../../models/user.interface";
import {AuthProvider} from "../../providers/auth/auth";
import {MappingProvider} from "../../providers/mapper/mapping";
import {UserData} from "../../providers/data/user-data";

@IonicPage()
@Component({
  selector: 'page-user-orgs',
  templateUrl: 'user-orgs.html',
})
export class UserOrgsPage implements OnInit{

  public userOrganizations: Array<IUserOrgs> = [];
  public ooid: string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authSvc: AuthProvider,
              private mappingSvc: MappingProvider,
              private userData: UserData,
              private dataSvc: DataProvider,
  ) {

  }

  ngOnInit(): void {
    let self = this;
    // this.userData.getCurrentOOID().then(oid=>{
    //   this.ooid = oid;})
    this.ooid = this.userData.currentOOId
    this.dataSvc.getUserOrgs(self.authSvc.getLoggedInUser().uid)
      .then( snapshot => {
        if (snapshot.val())
          this.mappingSvc.getUserOrgs(snapshot).forEach( oo => {
            self.userOrganizations.push(oo)
          });
        }).catch(error =>{
          //console.log(error)
    });

    //this.selectedOid = this.userData.getSelectedOrganization();
  }



  onSelectOrganization(o: IUserOrgs) {
    //console.log(o)
    this.userData.setCurrentOrg(o);
    this.navCtrl.setRoot('TabsPage');
    //this.ooid = o.oid;
    //console.log(this.ooid)
  }
}
