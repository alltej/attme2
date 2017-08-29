import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import {MemberProvider} from "../../providers/member/member";

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit
{
  ngOnInit(): void {
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();

      //console.log(this.userProfile);
      if (userProfileSnapshot.val().birthDate) {
        this.birthDate = userProfileSnapshot.val().birthDate;
      }

      // if (this.birthDate == null) {
      //   this.birthDate = new Date().toISOString();
      // }
    });
  }

  public userProfile:any;
  public birthDate:string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              public profileProvider: ProfileProvider,
              public authProvider: AuthProvider,
              public memberProvider: MemberProvider) {}

  // ionViewDidEnter() {
  //   this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
  //     this.userProfile = userProfileSnapshot.val();
  //     this.birthDate = userProfileSnapshot.val().birthDate;
  //     if (this.birthDate == null) {
  //       console.log(`$Hahahahaha:{this.birthDate}`);
  //       this.birthDate = new Date().toISOString();
  //     }
  //   });
  // }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot('login');
    });
  }

  updateName(){
    const alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
            this.memberProvider.updateName(this.userProfile.memberKey, data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate){
    this.profileProvider.updateDOB(birthDate);
  }

  updateEmail(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            let newEmail = data.newEmail;

            this.profileProvider.updateEmail(data.newEmail, data.password).then( () =>{
              this.userProfile.email = newEmail;
            }).catch(error => {
              console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }

}
