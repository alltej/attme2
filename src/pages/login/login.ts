import { Component } from '@angular/core';
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  AlertController
} from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import {UserData} from "../../providers/data/user-data";
import {DataProvider} from "../../providers/data/data";
import {MappingProvider} from "../../providers/mapper/mapping";

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
    public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: ['abc5@test.com', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['testpswd1', Validators.compose([Validators.minLength(6), Validators.required])]
    });
    this.appVersionNumber = "1.0.12";
    // if (this.platform.is('mobileweb') || this.platform.is('core')) {
    //   // This will only print when running on desktop
    //   //console.log("I'm a regular browser!");
    //   this.appVersionNumber = "1.0.9999";
    // }else{
    //   this.appVersion.getVersionNumber().then(result => {
    //     this.appVersionNumber = result;
    //   });
    // }
  }

  loginUser(): void {
    if (!this.loginForm.valid){
      //console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          if (authData){
            //console.log(`authData.emailVerified==${authData.emailVerified}`)
          }
          this.dataSvc.getUserOrgs(this.authProvider.getLoggedInUser().uid)
            .then( snapshot => {
              if (snapshot.val()){
                //self.userOrganizations = this.mappingSvc.getUserOrgs(snapshot);
                this.mappingSvc.getUserOrgs(snapshot).forEach( org => {
                  this.userData.setCurrentOrg(org)
                });

              }

            }).catch(error =>{
            console.log(error)
          });


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
