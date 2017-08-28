import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberCreatePage } from './member-create';

@NgModule({
  declarations: [
    MemberCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(MemberCreatePage),
  ],
  exports: [
    MemberCreatePage
  ]
})
export class MemberCreatePageModule {}
