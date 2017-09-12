import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthProvider } from '../providers/auth/auth';
import { EventProvider } from '../providers/event/event';
import { ProfileProvider } from '../providers/profile/profile';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {firebaseConfig} from "../config/firebase.config";
import { MemberProvider } from '../providers/member/member';
import { UserCircleProvider } from '../providers/user-circle/user-circle';
import {AttendanceProvider} from "../providers/event/attendance";
import { UserLikesProvider } from '../providers/user-likes/user-likes';
import { ProfileImageProvider } from '../providers/profile/profile-image';
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import {FileChooser} from "@ionic-native/file-chooser";

//import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

// const cloudSettings: CloudSettings = {
//   'core': {
//     'app_id': 'fc4e7ed2'
//   }
// };

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FilePath,
    FileChooser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    EventProvider,
    AttendanceProvider,
    ProfileProvider,
    MemberProvider,
    UserCircleProvider,
    UserLikesProvider,
    ProfileImageProvider
  ]
})
export class AppModule {}
