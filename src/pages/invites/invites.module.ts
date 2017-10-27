import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvitesPage } from './invites';

@NgModule({
  declarations: [
    InvitesPage,
  ],
  imports: [
    IonicPageModule.forChild(InvitesPage),
  ],
  exports: [
    InvitesPage
  ]
})
export class InvitesPageModule {}
