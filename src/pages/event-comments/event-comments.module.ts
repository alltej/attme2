import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCommentsPage } from './event-comments';
import {UserAvatarComponent} from "../../components/user-avatar";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    EventCommentsPage,

  ],
  imports: [
    ComponentsModule ,
    IonicPageModule.forChild(EventCommentsPage),
  ],
  exports: [
    EventCommentsPage,
    UserAvatarComponent,
  ]
})
export class EventCommentsPageModule {}
