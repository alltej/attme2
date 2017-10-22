import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventAttendeesPage } from './event-attendees';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    EventAttendeesPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(EventAttendeesPage),
  ],
  exports: [
    EventAttendeesPage
  ]
})
export class EventAttendeesPageModule {}
