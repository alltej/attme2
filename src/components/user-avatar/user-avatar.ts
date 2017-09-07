import {Component, OnInit} from '@angular/core';
import {AuthProvider} from "../../providers/auth/auth";

@Component({
  selector: 'user-avatar',
  template: ` <img *ngIf="imageLoaded" src="{{imageUrl}}" (click)="zoom()">`
})
export class UserAvatarComponent implements OnInit{
  private imageUrl: string;
  private imageLoaded: boolean;
  ngOnInit(): void {
  }

  text: string;

  constructor(private authSvc: AuthProvider) {
    if (this.authSvc.getActiveUser()) {

    }else {
      this.imageUrl = 'assets/img/profile.png';
      this.imageLoaded = true;
    }
  }

}
