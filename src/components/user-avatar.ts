import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../models/user.interface";
import {StorageProvider} from "../providers/storage/storage";
import {AuthProvider} from "../providers/auth/auth";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {DataProvider} from "../providers/data/data";

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
              private dataService: DataProvider,
              private photoViewer: PhotoViewer) {
    //console.log('Hello AttmeUserAvatarComponent Component');

  }

  ngOnInit() {
    this.imageUrl = 'assets/images/profile.png';
    this.imageLoaded = true;
    // let firebaseConnected: boolean = this.dataService.isFirebaseConnected();
    // if (this.user.uid === 'default' || !firebaseConnected) {
    //   console.log('this.user.uid===default')
    //   this.imageUrl = 'assets/images/profile.png';
    //   this.imageLoaded = true;
    // } else {
    //   console.log('this.user.uid!==default')
    //
    //   this.storageSvc.getStorageRef().child('images/' + this.user.uid + '/profile.png').getDownloadURL().then(function (url) {
    //     this.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
    //     this.imageLoaded = true;
    //   });
    // }
    /*
let defaultUrl = self.dataService.getDefaultImageUrl();
if (defaultUrl == null) {
    self.imageUrl = 'images/profile.png';
    self.imageLoaded = true;
    console.log('get from firebase');
    /*
    self.dataService.getStorageRef().child('images/' + self.user.uid + '/profile.png').getDownloadURL().then(function (url) {
        self.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
        self.imageLoaded = true;
    });

} else {
    this.imageUrl = defaultUrl.replace('default', self.user.uid) + '&t=' + (new Date().getTime());
    self.imageLoaded = true;
}*/
  }

  zoom() {
    this.photoViewer.show(this.imageUrl, this.user.username, { share: false });
  }

}
