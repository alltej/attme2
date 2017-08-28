import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCreatePage } from './event-create';

@NgModule({
  declarations: [
    EventCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(EventCreatePage),
  ],
  exports: [
    EventCreatePage
  ]
})
export class EventCreatePageModule {}
