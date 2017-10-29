import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import {IUserOrgs} from "../../models/user.interface";
//import { Storage } from '@ionic/storage';
//import {NativeStorage} from "@ionic-native/native-storage";
import {Storage} from "@ionic/storage";
//import {Storage} from "@ionic/storage";

@Injectable()
export class UserData {
    currentOOId: string
    currentOORole: number
    currentOOName: string
    likedBy: string
    HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(
    public events: Events,
    public storage: Storage) {

    if (this.currentOOId == null) {
      this.getCurrentOOID().then( data =>{
        this.currentOOId = data
      })
    }

    if (this.currentOORole == null) {
      this.getRole().then( data =>{
        this.currentOORole = data
      })
    }

    if (this.currentOOName == null) {
      this.getCurrentOOName().then( data =>{
        this.currentOOName = data
      })
    }

    if (this.likedBy == null) {
      this.getLikeByAvatar().then( data =>{
        this.likedBy = data
      })
    }
  }

  setCurrentOrg(selectedOrg: IUserOrgs): void {
    this.storage.set('currentOOID', selectedOrg.oid);
    this.storage.set('currentOOName', selectedOrg.name);
    this.storage.set('currentRole', selectedOrg.role);
    this.currentOOId = selectedOrg.oid
    this.currentOORole = selectedOrg.role
    this.currentOOName = selectedOrg.name
  };

  login(username: string, lastname: string, firstname: string): void {
    console.log(`userData:login:lastname==${lastname}:firstname==${firstname}`)
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    let avatar :string =  lastname + " " + firstname.charAt(0)
    this.setLikeByAvatar(avatar);
    this.events.publish('user:login');
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  setLikeByAvatar(name: string): void {
    this.storage.set('likeByAvatar', name);
  };

  getLikeByAvatar(): Promise<string> {
    return this.storage.get('likeByAvatar').then((value) => {
      return value;
    });
  };

  getCurrentOOID(): Promise<string> {
    return this.storage.get('currentOOID').then((value) => {
      return value;
    });
  };

  getCurrentUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  getCurrentOOName(): Promise<string> {
    return this.storage.get('currentOOName').then((value) => {
      return value;
    });
  };

  getRole(): Promise<number> {
    return this.storage.get('currentRole').then((value) => {
      return value;
    });
  }

  //TODO: Programmatically Update the MemberKey of the Current Organization
  getSelectOrgMemberKey(): string {
    //TODO
    return "-KwLvxN26_mAzB5NMLpM";
  };

  isEnableAddMember(){
    let allowedRoles: Array<number> = [1, 3]
    return  allowedRoles.some(n => n == this.currentOORole)
  }

  isEnableAddEvent(){
    let allowedRoles: Array<number> = [1, 3]
    return  allowedRoles.some(n => n == this.currentOORole)
  }

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');

    this.storage.remove('currentOOID');
    this.storage.remove('currentOOName');
    this.storage.remove('currentRole');

    this.events.publish('user:logout');

  }

}
