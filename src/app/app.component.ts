import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'tabs';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    firebase.initializeApp({
      apiKey: "AIzaSyBrsOXUmXDkcJycH0m3ujhhzZfk6WviUH0",
      authDomain: "attme-8d4f7.firebaseapp.com",
      databaseURL: "https://attme-8d4f7.firebaseio.com",
      projectId: "attme-8d4f7",
      storageBucket: "attme-8d4f7.appspot.com",
      messagingSenderId: "122392523636"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.rootPage = 'login';
        unsubscribe();
      } else {
        this.rootPage = 'tabs';
        unsubscribe();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

