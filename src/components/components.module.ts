import { NgModule } from '@angular/core';
import {UserAvatarComponent} from "./user-avatar";
import { CommonModule } from '@angular/common';
import {MemberAvatarComponent} from "./member-avatar";
import { IonTextAvatarComponent } from './ion-text-avatar/ion-text-avatar';
@NgModule({
	//declarations: [UserAvatarComponent, MemberAvatarComponent, IonTextAvatar],
	declarations: [UserAvatarComponent, MemberAvatarComponent,
    IonTextAvatarComponent],
  imports: [
    CommonModule
  ],
	// imports: [
  //   IonicPageModule.forChild(UserAvatarComponent)
  // ],
	exports: [
	  UserAvatarComponent,
      MemberAvatarComponent,
      IonTextAvatarComponent
  ]
})
export class ComponentsModule {}
