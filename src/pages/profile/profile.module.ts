import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import {UserAvatarComponent} from "../../components/user-avatar";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ProfilePage),
  ],
  exports: [
    ProfilePage,
    UserAvatarComponent
  ]
})
export class ProfilePageModule {}
