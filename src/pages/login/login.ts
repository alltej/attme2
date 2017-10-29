import { Component } from '@angular/core';
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  AlertController,  Platform
} from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import {UserData} from "../../providers/data/user-data";
import {DataProvider} from "../../providers/data/data";
import {MappingProvider} from "../../providers/mapper/mapping";
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  loading: Loading;
  public appVersionNumber: string;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    private dataSvc:DataProvider,
    private mappingSvc:MappingProvider,
    private userData: UserData,
    private platform: Platform,
    private appVersion: AppVersion,
    public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
    this.appVersionNumber = "1.0.19";
    if (this.platform.is('mobileweb') || this.platform.is('core')) {
      // This will only print when running on desktop
      //console.log("I'm a regular browser!");
      this.appVersionNumber = "1.0.1";
    }else{
      this.appVersion.getVersionNumber().then(result => {
        this.appVersionNumber = result;
      }).catch(e =>{

      });
    }
  }

  loginUser(): void {
    if (this.loginForm.valid) {
      this.authProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then(authData => {
          if (authData) {
            this.dataSvc.getUserInvite(authData.uid).then(invite => {
              if (invite.val()) {
                let inviteData = invite.val();
                this.dataSvc.getUserRef(authData.uid).child(`organizations/${inviteData.ooid}/`)
                  .set({
                    name: inviteData.ooName,
                    role: inviteData.role
                  })
                this.dataSvc.getUserRef(authData.uid).child(`profile`)
                  .set({
                    lastname: inviteData.lastname,
                    firstname: inviteData.firstname,
                  })
              }
            }).then(() => {
              this.dataSvc.getUserProfile(authData.uid).then(aUser => {
                return this.mappingSvc.getUser(aUser)

              }).then(user => {
                this.dataSvc.getUserOrgs(authData.uid)
                  .then(snapshot => {
                    if (snapshot.val()) {

                      this.userData.getCurrentUsername().then(value => {
                        if (value == authData.email) {
                          if (this.userData.currentOOId == null) {
                            let org = this.mappingSvc.getUserOrgs(snapshot)[0]
                            this.userData.setCurrentOrg(org)
                          }
                        } else {
                          let org = this.mappingSvc.getUserOrgs(snapshot)[0]
                          this.userData.setCurrentOrg(org)
                        }
                        this.userData.login(authData.email, user.lastname, user.firstname)
                      })
                    }
                  }).catch(error => {
                  //console.log(error)
                })

              })

            })
          }
          ;

          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot('TabsPage');
          });
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });

      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  goToSignup(): void {
    this.navCtrl.push('signup');
  }

  goToResetPassword(): void {
    this.navCtrl.push('reset-password');
  }
}
