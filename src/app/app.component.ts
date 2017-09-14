import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';
import {AuthProvider} from "../providers/auth/auth";
//import {firebaseConfig} from "../config/firebase.config";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'tabs';
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private menuCtrl: MenuController,
              private authService: AuthProvider) {


    // console.log('MyApp:constructor')
    // const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    //   //console.log('firebase.auth().onAuthStateChanged')
    //   if (!user) {
    //     console.log('aaa')
    //     console.log(user)
    //     this.isAuthenticated = true;
    //     this.rootPage = 'login';
    //     unsubscribe();
    //   } else {
    //     console.log('bbb')
    //     console.log(user)
    //     this.isAuthenticated = true;
    //     this.rootPage = 'tabs';
    //     unsubscribe();
    //   }
    // });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isAuthenticated = true;
        this.rootPage = 'tabs';
      } else {
        this.isAuthenticated = false;
        this.rootPage = 'login';
      }
    });

    // if (this.authService.getActiveUser() == null) {
    //       console.log('aaa')
    //       this.isAuthenticated = false;
    //       this.rootPage = 'login';
    //       //unsubscribe();
    // }else{
    //       console.log('bbb')
    //       this.isAuthenticated = true;
    //       this.rootPage = 'tabs';
    // }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any) {
    //console.log('MyApp:onLoad')
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.authService.logoutUser();
    this.menuCtrl.close();
    this.nav.setRoot('login');
  }
}

