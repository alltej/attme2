import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../models/user.interface";
import {StorageProvider} from "../providers/storage/storage";
import {AuthProvider} from "../providers/auth/auth";
import {PhotoViewer} from "@ionic-native/photo-viewer";

@Component({
  selector: 'user-avatar',
  template: ` <img *ngIf="imageLoaded" src="{{imageUrl}}" (click)="zoom()">`
})
export class UserAvatarComponent implements OnInit {

  @Input() public user: IUser;
  imageLoaded: boolean = false;
  imageUrl: string;
  private text: string;

  constructor(private storageSvc: StorageProvider,
              public authSvc: AuthProvider,
              private photoViewer: PhotoViewer) {
    //console.log('Hello AttmeUserAvatarComponent Component');

  }

  ngOnInit() {
    //TODO: need to load image in user avatar
    // this.storageSvc.getStorageRef().child('profileImages/' + this.authSvc.getActiveUser().uid)
    //   .getDownloadURL().then(url => {
    //     console.log(url)
    //   this.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
    //   this.imageLoaded = true;
    // }).catch(error =>{
    //   console.log(error)
    //   this.imageUrl = "assets/img/profile-default.png";
    //   this.imageLoaded = true;
    // })
    //this.text = 'Hello';
    //console.log(this.user.username)
      this.imageUrl = "assets/img/profile-default.png";
      this.imageLoaded = true;

    // if (this.userProfile.photoUrl == null) {
    //   this.avatar = "assets/img/profile-default.png";
    // }else{
    //   this.avatar = this.userProfile.photoUrl
    // }
  }

  zoom() {
    //TODO: implement zoom on user avatar
    //this.photoViewer.show(this.imageUrl, this.user.username, { share: false });
  }
}
