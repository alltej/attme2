import {Component, NgZone, OnInit} from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import {MemberProvider} from "../../providers/member/member";
import {ProfileImageProvider} from "../../providers/profile/profile-image";

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit
{
  public userProfile:any;
  public birthDate:string;
  userDataLoaded: boolean = false;
  avatar: string = "assets/img/profile-default.png";
  displayName: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              public profileSvc: ProfileProvider,
              private profileImageSvc: ProfileImageProvider,
              public authSvc: AuthProvider,
              public memberSvc: MemberProvider,
              public zone: NgZone,) {}

  ngOnInit(): void {
    this.profileSvc.getUserProfile().on('value', snapShot => {
      this.userProfile = snapShot.val();

      //console.log(this.userProfile);
      if (snapShot.val().birthDate) {
        this.birthDate = snapShot.val().birthDate;
      }
      this.zone.run(() => {
        this.avatar = snapShot.val().photoURL;
      })
      if (this.userProfile.photoUrl == null) {
        this.avatar = "assets/img/profile-default.png";
      }else{
        this.avatar = this.userProfile.photoUrl
      }
      this.userDataLoaded = true;
      // if (this.birthDate == null) {
      //   this.birthDate = new Date().toISOString();
      // }
    });
  }
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
    this.authSvc.logoutUser().then(() => {
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
            this.profileSvc.updateName(data.firstName, data.lastName);
            this.memberSvc.updateName(this.userProfile.memberKey, data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate){
    this.profileSvc.updateDOB(birthDate);
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

            this.profileSvc.updateEmail(data.newEmail, data.password).then( () =>{
              this.userProfile.email = newEmail;
            }).catch(error => {
              //console.log('ERROR: '+error.message);
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
            this.profileSvc.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }

  editimage() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    this.profileImageSvc.uploadimage().then((url: any) => {
      this.profileSvc.updateimage(url).then((res: any) => {
        if (res.success) {
          statusalert.setTitle('Updated');
          statusalert.setSubTitle('Your profile pic has been changed successfully!!');
          statusalert.present();
          this.zone.run(() => {
            this.avatar = url;
          })
        }
      }).then( () =>{
        //console.log(`ProfilePage::${this.userProfile.memberKey}`)
        this.memberSvc.updatePhotoUrl(this.userProfile.memberKey, this.avatar)
      })
        .catch((err) => {
        statusalert.setTitle('Failed');
        statusalert.setSubTitle('Your profile pic was not changed');
        statusalert.present();
      })
    })
  }
}
