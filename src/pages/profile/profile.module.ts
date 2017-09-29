import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import {UserAvatarComponent} from "../../components/user-avatar";

@NgModule({
  declarations: [
    ProfilePage,
    UserAvatarComponent
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  exports: [
    ProfilePage,
    UserAvatarComponent
  ]
})
export class ProfilePageModule {}
