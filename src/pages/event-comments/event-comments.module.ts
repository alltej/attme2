import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCommentsPage } from './event-comments';
import {AttmeUserAvatarComponent} from "../../components/attme-user-avatar/attme-user-avatar";
//import {CommentCreatePage} from "../comment-create/comment-create";

@NgModule({
  declarations: [
    EventCommentsPage,
    AttmeUserAvatarComponent,
  ],
  imports: [
    IonicPageModule.forChild(EventCommentsPage),
  ],
  exports: [
    EventCommentsPage,
    AttmeUserAvatarComponent,
  ]
})
export class EventCommentsPageModule {}
