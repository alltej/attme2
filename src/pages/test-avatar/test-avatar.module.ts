import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestAvatarPage } from './test-avatar';
import {ComponentsModule} from "../../components/components.module";
@NgModule({
  declarations: [
    TestAvatarPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TestAvatarPage),
  ]
})
export class TestAvatarPageModule {}
