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
  }

  setCurrentOrg(selectedOrg: IUserOrgs): void {
    this.storage.set('currentOOID', selectedOrg.oid);
    this.storage.set('currentOOName', selectedOrg.name);
    this.storage.set('currentRole', selectedOrg.role);
    this.currentOOId = selectedOrg.oid
    this.currentOORole = selectedOrg.role
    this.currentOOName = selectedOrg.name
  };

  login(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
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


  getCurrentOOID(): Promise<string> {
    return this.storage.get('currentOOID').then((value) => {
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


  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');

    this.storage.remove('currentOOID');
    this.storage.remove('currentOOName');
    this.storage.remove('currentRole');

    this.events.publish('user:logout');


  }

}
