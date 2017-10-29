import {Component, OnInit} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
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
              public dataSvc: DataProvider,
              public events: Events
  ) {}

  ngOnInit(): void {
    let self = this;
    self.events.subscribe('invites:add', self.loadMyOrganizations);
    self.ooid = self.userData.currentOOId
    self.loadMyOrganizations();
  }


  private loadMyOrganizations() {
    let self = this;

    self.dataSvc.getUserOrgs(self.authSvc.getLoggedInUser().uid)
      .then(snapshot => {
        if (snapshot.val())
          self.mappingSvc.getUserOrgs(snapshot).forEach(oo => {
            self.userOrganizations.push(oo)
          });
      }).catch(error => {
    });
  }

  onSelectOrganization(o: IUserOrgs) {
    this.userData.setCurrentOrg(o);
    this.navCtrl.setRoot('TabsPage');
  }
}
