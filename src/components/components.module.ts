import { NgModule } from '@angular/core';
import { IonicPageModule  } from 'ionic-angular';
import {UserAvatarComponent} from "./user-avatar";
import { CommonModule } from '@angular/common';
@NgModule({
	declarations: [UserAvatarComponent],
  imports: [
    CommonModule
  ],
	// imports: [
  //   IonicPageModule.forChild(UserAvatarComponent)
  // ],
	exports: [UserAvatarComponent]
})
export class ComponentsModule {}
