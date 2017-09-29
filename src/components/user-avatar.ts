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
    let firebaseConnected: boolean = this.dataService.isFirebaseConnected();
    if (this.user.uid === 'default' || !firebaseConnected) {
      this.imageUrl = 'assets/images/profile.png';
      this.imageLoaded = true;
    } else {
      this.storageSvc.getStorageRef().child('images/' + this.user.uid + '/profile.png').getDownloadURL()
        .then(url=> {
          //this.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
          this.imageUrl = url;
          this.imageLoaded = true;
      });
    }
  }

  zoom() {
    this.photoViewer.show(this.imageUrl, this.user.username, { share: false });
  }

}
