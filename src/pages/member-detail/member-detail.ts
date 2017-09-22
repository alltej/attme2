import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {MemberProvider} from "../../providers/member/member";
//import {FirebaseObjectObservable} from "angularfire2/database";
import {AuthProvider} from "../../providers/auth/auth";
import {BaseClass} from "../BasePage";
import {ProfileImageProvider} from "../../providers/profile/profile-image";
import {MemberInviteProvider} from "../../providers/member/member-invite";

@IonicPage({
  name: 'member-detail',
  segment: 'member-detail/:memberKey'
})
@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html',
})
export class MemberDetailPage extends BaseClass implements OnInit{
  private memberKey: any;

  public member: any = {};
  public isUserProfileExists: boolean = false;
  private enableEditEmail: boolean = false;
  private enableInvite: boolean = false;
  avatar: string = "assets/img/profile-default.png";

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              private memberSvc: MemberProvider,
              private profileImageSvc: ProfileImageProvider,
              private memberInviteSvc: MemberInviteProvider,
              public zone: NgZone) {
    super();
    this.memberKey = this.navParams.get('memberKey');
  }

  ngOnInit(): void {
    //console.log(`MemberDetailPage::${this.memberKey}`);
    this.memberSvc.getMember(this.memberKey)
      .takeUntil(this.componentDestroyed$)
      .subscribe((data)=>{
        if (data!=null) {
          this.member = data;
          //TODO
          //this.avatar = 'assets/img/profile.png';
          //this.member.imageUrl = 'assets/img/profile.png';
          this.zone.run(() => {
            this.avatar = this.member.photoUrl;
          })
          if (this.member.photoUrl == null) {
            this.avatar = "assets/img/profile-default.png";
          }else{
            this.avatar = this.member.photoUrl
          }
        }
      });

    this.memberSvc.findMemberId(this.memberKey)
      //.takeUntil(this.componentDestroyed$)
      .subscribe((data) => {
        if (data.length>0) {
          this.isUserProfileExists = true;
        }else{
          //this.isUserProfileExists = (this.member.email==null);//true;
        }
        this.enableEditEmail = !this.isUserProfileExists||(this.member.email==null);
      });
  }


  updateName(){
    const alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.member.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.member.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.memberSvc.updateName(this.memberKey, data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  // updateDOB(birthDate){
  //   this.profileProvider.updateDOB(birthDate);
  // }

  updateEmail(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            //let newEmail = data.newEmail;

            this.memberSvc.updateEmail(this.memberKey, data.newEmail).then( () =>{
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate){
    //this.profileProvider.updateDOB(birthDate);
  }

  updateMemberId(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newMemberId',
          value: this.member.memberId,
          placeholder: 'Your member ID if any',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.memberSvc.updateMemberId(this.memberKey, data.newMemberId).then( () =>{
            }).catch(error => {
              //console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  onCreateInvite() {
    //console.log(`onCreateInvite::${this.memberKey},${this.member.email}`);
    this.memberInviteSvc.createUserInvite(this.memberKey, this.member.lastName, this.member.firstName, this.member.email);

  }

  editimage() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    this.profileImageSvc.uploadMemberImage(this.memberKey).then((url: any) => {
      this.memberSvc.updatePhotoUrl(this.memberKey, url).then((res: any) => {
        if (res.success) {
          statusalert.setTitle('Updated');
          statusalert.setSubTitle('Your profile pic has been changed successfully!!');
          statusalert.present();
          this.zone.run(() => {
            this.avatar = url;
          })
        }
      }).catch((err) => {
          statusalert.setTitle('Failed');
          statusalert.setSubTitle('Your profile pic was not changed');
          statusalert.present();
        })
    })
  }
}
