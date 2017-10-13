import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserOrgsPage } from './user-orgs';

@NgModule({
  declarations: [
    UserOrgsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserOrgsPage),
  ],
})
export class UserOrgsPageModule {}
