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
    let self = this;
    let firebaseConnected: boolean = self.dataService.isFirebaseConnected();
    if (self.user.uid === 'default' || !firebaseConnected) {
      self.imageUrl = 'assets/images/profile.png';
      self.imageLoaded = true;
    } else {
      self.storageSvc.getStorageRef().child('users/' + self.user.uid + '/profile.png').getDownloadURL()
        .then(url=> {
          //self.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
          self.imageUrl = url;
          self.imageLoaded = true;
      });
    }
  }

  zoom() {
    this.photoViewer.show(this.imageUrl, this.user.username, { share: false });
  }

}
