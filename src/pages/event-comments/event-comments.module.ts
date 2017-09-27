import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCommentsPage } from './event-comments';

@NgModule({
  declarations: [
    EventCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventCommentsPage),
  ],
  exports: [
    EventCommentsPage
  ]
})
export class EventCommentsPageModule {}
