import { Component } from '@angular/core';
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  AlertController, Events, Platform
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
    if (!this.loginForm.valid){
      //console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          if (authData){
            this.dataSvc.getUser(authData.uid).then( aUser =>{
                //console.log(`loginUser::createUser`)
                if (!aUser.val()) {
                  //console.log(`loginUser::createUser==TRUE`)
                  this.dataSvc.getUserRef(authData.uid).child('profile').set({
                    email: authData.email
                  });
                }
            }).then(() =>{
                //console.log(`authData.emailVerified==${authData.emailVerified}`)
                //console.log(`authData.uid==${authData.uid}`)
                this.dataSvc.getUserInvite(authData.uid).then( invite =>{
                  //console.log(`getUserInvite`)
                  if (invite.val()){
                    //console.log(`loginUser::inviteExists==TRUE`)
                    let inviteData = invite.val();
                    //console.log(`inviteData::${inviteData}`)
                    this.dataSvc.getUserRef(authData.uid).child(`organizations/${inviteData.ooid}/`)
                      .set({
                        name: inviteData.ooName,
                        role: inviteData.role
                      })
                  }
                })
            }).then(()=>{
              //console.log(`getUserOrgs::${authData.uid}`)
              this.dataSvc.getUserOrgs(authData.uid)
                .then( snapshot => {
                  if (snapshot.val()){
                    //console.log(`getUserOrgs::snapshot==${snapshot.val()}`)

                    //self.userOrganizations = this.mappingSvc.getUserOrgs(snapshot);
                    //TODO: set first to default
                    this.mappingSvc.getUserOrgs(snapshot).forEach( org => {
                      this.userData.setCurrentOrg(org)
                    });
                    this.userData.login(authData.email)
                  }

                }).catch(error =>{
                //console.log(error)
              })
            })
          }
          ;

          this.loading.dismiss().then( () => {
            this.navCtrl.setRoot('TabsPage');
          });
        }, error => {
          this.loading.dismiss().then( () => {
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
