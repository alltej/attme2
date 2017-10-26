import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, Platform} from 'ionic-angular';
import {AppVersion} from "@ionic-native/app-version";

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage implements OnInit{
  public appName: string;
  public appVersionNumber: string;


  constructor(
      public navCtrl: NavController,
      private platform: Platform,
      private appVersion: AppVersion) {
    this.appName = "AttMe";
    this.appVersionNumber = "1.0.12";
    // if (this.platform.is('mobileweb') || this.platform.is('core')) {
    //   // This will only print when running on desktop
    //   //console.log("I'm a regular browser!");
    //   this.appName = "AttMe";
    //   this.appVersionNumber = "1.0.9999";
    // }
  }

  // constructor(
  //     public platform: Platform,
  //     public navCtrl: NavController,
  //     public appVersion: AppVersion) {
  //   this.appName = "AttMe";
  //   this.appVersionNumber = "1.0.12";
  //   // if (this.platform.is('mobileweb') || this.platform.is('core')) {
  //   //   // This will only print when running on desktop
  //   //   //console.log("I'm a regular browser!");
  //   //   this.appName = "AttMe";
  //   //   this.appVersionNumber = "1.0.9999";
  //   // }
  // }

   ngOnInit(): void {
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
}
