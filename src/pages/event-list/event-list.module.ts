import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventListPage } from './event-list';

@NgModule({
  declarations: [
    EventListPage,
  ],
  imports: [
    IonicPageModule.forChild(EventListPage),
  ],
  exports: [
    EventListPage
  ]
})
export class EventListPageModule {}
