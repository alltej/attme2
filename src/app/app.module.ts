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
import {MemberInviteProvider} from "../providers/member/member-invite";
import {EventCommentsProvider} from "../providers/event/event-comments";
import {ItemsProvider} from "../providers/mapper/items-provider";
import {MappingProvider} from "../providers/mapper/mapping";
import { StorageProvider } from '../providers/storage/storage';
import {PhotoViewer} from "@ionic-native/photo-viewer";
import { DataProvider } from '../providers/data/data';

//import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

// const cloudSettings: CloudSettings = {
//   'core': {
//     'app_id': 'fc4e7ed2'
//   }
// };

declare var window;

export class MyErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    window.Ionic.handleNewError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
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
    //{provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: ErrorHandler, useClass: MyErrorHandler },
    AuthProvider,
    EventProvider,
    AttendanceProvider,
    ProfileProvider,
    MemberProvider,
    UserCircleProvider,
    UserLikesProvider,
    ProfileImageProvider,
    MemberInviteProvider,
    EventCommentsProvider,
    ItemsProvider,
    MappingProvider,
    StorageProvider,
    PhotoViewer,
    DataProvider
  ]
})
export class AppModule {}
