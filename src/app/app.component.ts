import {Component, ViewChild} from '@angular/core';
import {Events, MenuController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {AuthProvider} from "../providers/auth/auth";
import {DataProvider} from "../providers/data/data";
import {Network} from "@ionic-native/network";
import {HomePage} from "../pages/home/home";
import {UserData} from "../providers/data/user-data";

declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage: any = 'tabs';
  @ViewChild('content') nav: any;
  public rootPage: any;
  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public network: Network,
              private dataSvc: DataProvider,
              private menuCtrl: MenuController,
              private authService: AuthProvider,
              public events: Events,
              public userData: UserData) {

    let self = this;
    //this.rootPage = 'TabsPage';
    this.rootPage = HomePage;
    platform.ready().then(() => {
      if (window.cordova) {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        self.watchForConnection();
        self.watchForDisconnect();
        splashScreen.hide();
      }
    });

    //TODO: enable this
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      //console.log(`appComponent::hasLoggedIn==${hasLoggedIn}`)
      this.enableMenu(hasLoggedIn === true);
      if (hasLoggedIn){
        this.rootPage = 'LoginPage';
      }
    });
    this.enableMenu(true);
    this.listenToLoginEvents();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      //this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menuCtrl.enable(loggedIn, 'loggedInMenu');
    //this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  watchForConnection() {
    //console.log(`AppComponent::watchForConnection`)

    var self = this;
    self.network.onConnect().subscribe(() => {
      //console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      setTimeout(() => {
        //console.log('we got a connection..');
        //console.log('Firebase: Go Online..');
        self.dataSvc.goOnline();
        self.events.publish('network:connected', true);
      }, 3000);
    });
  }

  watchForDisconnect() {
    //console.log(`AppComponent::watchForDisconnect`)

    var self = this;
    // watch network for a disconnect
    self.network.onDisconnect().subscribe(() => {
      //console.log('network was disconnected :-(');
      //console.log('Firebase: Go Offline..');
      //self.sqliteService.resetDatabase();
      self.dataSvc.goOffline();
      self.events.publish('network:connected', false);
    });
  }

  ngAfterViewInit() {
    var self = this;

    this.authService.onAuthStateChanged(function (user) {
      //console.log(`AppComponent::ngAfterViewInit::onAuthStateChanged`)
      if (user === null) {
        //console.log(`AppComponent::ngAfterViewInit::onAuthStateChanged::user === null`)
        self.menuCtrl.close();
        self.nav.setRoot('LoginPage');
      }
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    var self = this
    self.menuCtrl.close()
    self.authService.logoutUser()
    this.userData.logout();
  }

  isUserLoggedIn(): boolean {
    let user = this.authService.getLoggedInUser();
    return user !== null;
  }
}

