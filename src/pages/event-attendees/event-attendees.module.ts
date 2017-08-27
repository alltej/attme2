import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventAttendeesPage } from './event-attendees';

@NgModule({
  declarations: [
    EventAttendeesPage,
  ],
  imports: [
    IonicPageModule.forChild(EventAttendeesPage),
  ],
  exports: [
    EventAttendeesPage
  ]
})
export class EventAttendeesPageModule {}
