import {Component, OnInit} from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {UserData} from "../../providers/data/user-data";
import {IInvite} from "../../models/invite.interface";
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-invites',
  templateUrl: 'invites.html',
})
export class InvitesPage implements OnInit{

  invites: Array<IInvite> = [];
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              private dataSvc: DataProvider,
              private userData: UserData,
              private authSvc: AuthProvider,
              public events: Events) {
  }

  ngOnInit(): void {
    let self = this;

    self.loadInvites();
  }

  private loadInvites() {
    let self = this;
    self.invites = [];
    self.userData.getCurrentUsername().then(email => {
      this.dataSvc.getInvitesRef()
        .orderByChild('email').equalTo(email)
        .on('value', snapshot => {
          let list = snapshot.val();
          if (list == null) return
          Object.keys(snapshot.val()).map((key: any) => {
            let anEvent: any = list[key];
            this.invites.push({
              inviteKey: key,
              ooid: anEvent.ooid,
              ooName: anEvent.ooName,
              role: anEvent.role,
              email: anEvent.email
            });
          });

        })
    });
  }

  onAcceptInvitation(o: IInvite){
    let self = this;
    const alert = self.alertCtrl.create({
      title: 'Accept Invitation?',
      message: "Accept invitation to join " + o.ooName + "?",
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Accept',
          handler: data => {
            let self = this;

            self.dataSvc.getUserRef(self.authSvc.getLoggedInUser().uid).child(`organizations/${o.ooid}/`)
              .set({
                oid: o.ooid,
                name: o.ooName,
                role: o.role
              }).then(()=>{
              self.dataSvc.getInvitesRef().child(o.inviteKey).remove()
            }).then(() =>{
              self.events.publish('invites:add');
              self.loadInvites()
            })


          }
        }
      ]
    });
    alert.present();
  }

  onAcceptInvitationOrig(o: IInvite) {
    let self = this;

    self.dataSvc.getUserRef(this.authSvc.getLoggedInUser().uid).child(`organizations/${o.ooid}/`)
      .set({
        name: o.ooName,
        role: o.role
      }).then(()=>{
      this.dataSvc.getInvitesRef().child(o.inviteKey).remove()
    })

    self.events.publish('invites:add');

    // this.dataSvc.getUserRef(this.authSvc.getLoggedInUser().uid).child(`profile`)
    //   .set({
    //     lastname: inviteData.lastname,
    //     firstname: inviteData.firstname,
    //   })

  }
}
