import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage implements OnInit{
  public appName: string;
  public appVersionNumber: string;


  constructor(
      public navCtrl: NavController) {
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
  //   //console.log('ngOnInit')
  //   try {
  //     if (this.appVersion != null) {
  //       //console.log('if (this.appVersion != null)')
  //       this.appVersion.getAppName().then(result => {
  //         this.appName = result;
  //       });
  //       this.appVersion.getVersionNumber().then(result => {
  //         this.appVersionNumber = result;
  //       });
  //     } else {
  //       this.appName = "AttMe";
  //       this.appVersionNumber = "1.0.8888";
  //     }
  //   } catch (e) {
  //     console.log('catch (e)')
  //     this.appName = "AttMe";
  //     this.appVersionNumber = "1.0.88";
  //   }
  //
   }
}
