import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../models/user.interface";
import {StorageProvider} from "../../providers/storage/storage";
import {AuthProvider} from "../../providers/auth/auth";
import {PhotoViewer} from "@ionic-native/photo-viewer";

@Component({
  selector: 'user-avatar',
  template: ` <img *ngIf="imageLoaded" src="{{imageUrl}}" (click)="zoom()">`
})
export class UserAvatarComponent implements OnInit {
  @Input() user: IUser;
  imageLoaded: boolean = false;
  imageUrl: string;

  constructor(private storageSvc: StorageProvider,
              public authSvc: AuthProvider,
              private photoViewer: PhotoViewer) { }

  ngOnInit() {
    // this.storageSvc.getStorageRef().child('images/' + this.authSvc.getActiveUser().uid + '/profile.png').getDownloadURL().then(function (url) {
    //   this.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
    //   this.imageLoaded = true;
    // }

    this.imageUrl = "assets/img/profile-default.png";
    this.imageLoaded = true;

    // if (this.userProfile.photoUrl == null) {
    //   this.avatar = "assets/img/profile-default.png";
    // }else{
    //   this.avatar = this.userProfile.photoUrl
    // }
  }

  zoom() {
    this.photoViewer.show(this.imageUrl, this.user.username, { share: false });
  }


}
