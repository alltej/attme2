import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentCreatePage } from './comment-create';

@NgModule({
  declarations: [
    CommentCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(CommentCreatePage),
  ],
  exports: [
    CommentCreatePage
  ]
})
export class CommentCreatePageModule {}
