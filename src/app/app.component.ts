import {Component, ViewChild} from '@angular/core';
import {Events, MenuController, ModalController, NavController, Platform, ViewController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import firebase from 'firebase';
import {AuthProvider} from "../providers/auth/auth";
import {SignupPage} from "../pages/signup/signup";
import {DataProvider} from "../providers/data/data";
import {Network} from "@ionic-native/network";
import {HomePage} from "../pages/home/home";

//import {firebaseConfig} from "../config/firebase.config";
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
              public modalCtrl: ModalController) {


    //console.log('MyApp:constructor')
    // const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    //   //console.log('firebase.auth().onAuthStateChanged')
    //   if (!user) {
    //     //console.log('aaa')
    //     //console.log(user)
    //     this.isAuthenticated = true;
    //     this.rootPage = 'login';
    //     unsubscribe();
    //   } else {
    //     //console.log('bbb')
    //     //console.log(user)
    //     this.isAuthenticated = true;
    //     this.rootPage = 'tabs';
    //     unsubscribe();
    //   }
    // });

    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.isAuthenticated = true;
    //     this.rootPage = 'tabs';
    //   } else {
    //     this.isAuthenticated = false;
    //     this.rootPage = 'login';
    //   }
    // });

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
    let self = this;
    this.rootPage = 'TabsPage';
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

    this.listenToLoginEvents();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      //this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      //this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      //this.enableMenu(false);
    });
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
      console.log(`AppComponent::ngAfterViewInit::onAuthStateChanged`)
      if (user === null) {
        console.log(`AppComponent::ngAfterViewInit::onAuthStateChanged::user === null`)
        self.menuCtrl.close();
        //self.nav.setRoot(LoginPage);
        //this.rootPage = 'LoginPage';
        let loginodal = self.modalCtrl.create('LoginPage');
        loginodal.present();
      }else{
        console.log(`AppComponent::ngAfterViewInit::onAuthStateChanged::user !== null`)
        console.log(`user==${user}`)
        this.rootPage = HomePage;
      }
    });
  }

  onLoad(page: any) {
    console.log(`MyApp:onLoad::${page}`)
    this.nav.setRoot(page);
    this.menuCtrl.close();

    // let viewCtrl: ViewController = this.nav.getActive();
    // // close the menu when clicking a link from the menu
    // this.menuCtrl.close();
    //
    // if (page === 'SignupPage') {
    //   console.log(`SignupPage`)
    //
    //   if (!(viewCtrl.instance instanceof SignupPage)){
    //     console.log(`instanceof SignupPage`)
    //     this.nav.push(page);
    //   }
    // }
    // else{
    //   this.nav.setRoot(page);
    // }
  }

  onLogout() {
    // this.authService.logoutUser();
    // this.menuCtrl.close();
    // this.nav.setRoot('login');

    var self = this
    self.menuCtrl.close()
    self.authService.logoutUser()
  }

  isUserLoggedIn(): boolean {
    let user = this.authService.getLoggedInUser();
    return user !== null;
  }
}

