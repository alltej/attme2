import { NgModule } from '@angular/core';
import { IonTextAvatar } from 'ionic-text-avatar';
//import { IonicPageModule  } from 'ionic-angular';
import {UserAvatarComponent} from "./user-avatar";
import { CommonModule } from '@angular/common';
import {MemberAvatarComponent} from "./member-avatar";
@NgModule({
	declarations: [UserAvatarComponent, MemberAvatarComponent, IonTextAvatar],
  imports: [
    CommonModule
  ],
	// imports: [
  //   IonicPageModule.forChild(UserAvatarComponent)
  // ],
	exports: [UserAvatarComponent,
    MemberAvatarComponent,
    IonTextAvatar]
})
export class ComponentsModule {}
