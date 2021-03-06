import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberListPage } from './member-list';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    MemberListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MemberListPage),
  ],
  exports: [
    MemberListPage
  ]
})
export class MemberListPageModule {}
