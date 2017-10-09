import { NgModule } from '@angular/core';
//import { IonicPageModule  } from 'ionic-angular';
import {UserAvatarComponent} from "./user-avatar";
import { CommonModule } from '@angular/common';
import {MemberAvatarComponent} from "./member-avatar";
@NgModule({
	declarations: [UserAvatarComponent, MemberAvatarComponent],
  imports: [
    CommonModule
  ],
	// imports: [
  //   IonicPageModule.forChild(UserAvatarComponent)
  // ],
	exports: [UserAvatarComponent, MemberAvatarComponent]
})
export class ComponentsModule {}
