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
})
export class EventAttendeesPageModule {}
