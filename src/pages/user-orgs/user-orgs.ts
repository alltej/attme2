import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {IOrganization} from "../../models/user.interface";
import {AuthProvider} from "../../providers/auth/auth";
import {MappingProvider} from "../../providers/mapper/mapping";
import {UserData} from "../../providers/data/user-data";

@IonicPage()
@Component({
  selector: 'page-user-orgs',
  templateUrl: 'user-orgs.html',
})
export class UserOrgsPage implements OnInit{

  //public iMembers: Array<IMember> = [];
  public userOrganizations: Array<IOrganization> = [];
  public selectedOid: string;
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
    this.selectedOid = self.userData.getSelectedOrganization();

    this.dataSvc.getUserOrgs(self.authSvc.getLoggedInUser().uid)
      .then( snapshot => {
        if (snapshot.val())
          console.log(snapshot)
          self.userOrganizations = this.mappingSvc.getOrganizations(snapshot);
        }).catch(error =>{
          console.log(error)
    });

    //this.selectedOid = this.userData.getSelectedOrganization();
  }



  onSelectOrganization(o: IOrganization) {
    console.log(o)
    this.userData.setSelectedOrganization(o.oid);
    this.selectedOid = this.userData.getSelectedOrganization();
    console.log(this.selectedOid)
  }
}
