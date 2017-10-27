import {Component, OnInit} from '@angular/core';
import { IonicPage,
  NavController,
  Loading,
  LoadingController,
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';
import {DataProvider} from "../../providers/data/data";
import {MappingProvider} from "../../providers/mapper/mapping";
import {UserData} from "../../providers/data/user-data";
import {CheckedValidator} from "../../validators/check-validator";

@IonicPage({
  name: 'signup'
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage implements OnInit{

  termsChecked: boolean = false
  public signupForm: FormGroup;
  loading: Loading;
  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
              public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
              private dataSvc: DataProvider,
              private mappingSvc: MappingProvider,
              private userData: UserData,
              public alertCtrl: AlertController) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      terms: [false, CheckedValidator.isChecked]
    });
  }

  signupUser(){
    if (!this.signupForm.valid){
      //console.log(this.signupForm.value);
    } else {
      this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password)
        .then((authData) => {
        //TODO: refactor by merging similar code in login page
          if (authData){
            this.dataSvc.getUser(authData.uid)
              .then( aUser =>{
                if (!aUser.val()) {
                  //console.log(`loginUser::createUser==TRUE`)
                  this.dataSvc.getUserRef(authData.uid).child('profile').set({
                    email: authData.email
                  });
                }
              }
            ).then(() =>{
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
              this.dataSvc.getUserOrgs(authData.uid)
                .then( snapshot => {
                  if (snapshot.val()){
                    //self.userOrganizations = this.mappingSvc.getUserOrgs(snapshot);
                    //TODO: set first to default
                    this.mappingSvc.getUserOrgs(snapshot).forEach( org => {
                      this.userData.setCurrentOrg(org)
                    });
                    this.userData.login(authData.email)
                  }else{

                  }

                }).catch(error =>{
                //console.log(error)
              })
            })
          }
          else{
          }

          this.loading.dismiss().then( () => {
            this.navCtrl.setRoot('TabsPage');
          });
        }, (error) => {
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


}
