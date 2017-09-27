import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCommentsPage } from './event-comments';
import {UserAvatarComponent} from "../../components/user-avatar";

@NgModule({
  declarations: [
    EventCommentsPage,
    UserAvatarComponent,
  ],
  imports: [
    IonicPageModule.forChild(EventCommentsPage),
  ],
  exports: [
    EventCommentsPage,
    UserAvatarComponent,
  ]
})
export class EventCommentsPageModule {}
