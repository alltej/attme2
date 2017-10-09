import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../models/user.interface";
import {StorageProvider} from "../providers/storage/storage";
import {AuthProvider} from "../providers/auth/auth";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {DataProvider} from "../providers/data/data";
import {IMember} from "../models/member.interface";

@Component({
  selector: 'member-avatar',
  template: ` <img *ngIf="imageLoaded" src="{{imageUrl}}" (click)="zoom()">`
})
export class MemberAvatarComponent implements OnInit {

  @Input() public member: IMember;
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
    if (this.member.uid === 'default' || !firebaseConnected) {
      this.imageUrl = 'assets/images/profile.png';
      this.imageLoaded = true;
    } else {
      this.storageSvc.getStorageRef().child('members/' + this.member.memberKey + '/profile.png').getDownloadURL()
        .then(url=> {
          //this.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
          this.imageUrl = url;
          this.imageLoaded = true;
      });
    }
  }

  zoom() {
    this.photoViewer.show(this.imageUrl, this.member.email, { share: false });
  }

}
