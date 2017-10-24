import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import {IUserOrgs} from "../../models/user.interface";
//import { Storage } from '@ionic/storage';
//import {NativeStorage} from "@ionic-native/native-storage";
import {Storage} from "@ionic/storage";
//import {Storage} from "@ionic/storage";

@Injectable()
export class UserData {
    ooid: string
    role: number

  constructor(
    public events: Events,
    public storage: Storage) {
      this.getCurrentOOID()
      this.getRole()
  }


  setCurrentOrg(selectedOrg: IUserOrgs): void {
    //console.log(`setCurrentOOID==${selectedOrg}`)
    try {
      this.storage.set('currentOOID', selectedOrg.oid);
      this.storage.set('currentRole', selectedOrg.role);
    } catch (e) {
      //console.log(`setCurrentOrg::${e}`)
    }
    this.ooid=selectedOrg.oid;
    this.role=selectedOrg.role;
    //this.storage.set('ooid', sessionName);
  };

  getCurrentOOID(): string {
    //return Promise.resolve("-KwCMJMRwy57wGWfVfry");
    //return this.currentOoId; //"-KwCMJMRwy57wGWfVfry"
    try {
      this.storage.get('currentOOID').then((value) => {
        this.ooid = value;
      });
    } catch (e) {
      //console.log(`getCurrentOOID::${e}`)
      //console.log(`getCurrentOOID::this.ooid==${this.ooid}`)
    }

    return this.ooid;
    //
    // return this.storage.get('ooid').then((value) => {
    //   return value;
    // });
  };

  getRole(): number {
    this.storage.get('currentRole').then((value) => {
      this.role = value;
    }).catch(e => {
      //console.log(`getRole::${e}`)
      this.role = 5
    })
    return this.role;
  };

  //TODO: Programmatically Update the MemberKey of the Current Organization
  getSelectOrgMemberKey(): string {
    return "-KwLvxN26_mAzB5NMLpM";
  };

  // //public userOrganizations: Array<IOrganization> = [];
  // setOrganizations(orgs: Array<IOrganization>){
  //   this._organizations = orgs;
  // }
  //
  // getOrganizations(): Array<IOrganization>{
  //   return this._organizations;
  // }
  //
  // hasFavorite(sessionName: string): boolean {
  //   return (this._favorites.indexOf(sessionName) > -1);
  // };
  //
  // addFavorite(sessionName: string): void {
  //   this._favorites.push(sessionName);
  // };
  //
  // removeFavorite(sessionName: string): void {
  //   let index = this._favorites.indexOf(sessionName);
  //   if (index > -1) {
  //     this._favorites.splice(index, 1);
  //   }
  // };
  //
  // login(username: string): void {
  //   this.storage.set(this.HAS_LOGGED_IN, true);
  //   this.setUsername(username);
  //   this.events.publish('user:login');
  // };
  //
  // signup(username: string): void {
  //   this.storage.set(this.HAS_LOGGED_IN, true);
  //   this.setUsername(username);
  //   this.events.publish('user:signup');
  // };
  //
  // logout(): void {
  //   this.storage.remove(this.HAS_LOGGED_IN);
  //   this.storage.remove('username');
  //   this.events.publish('user:logout');
  // };
  //
  // setUsername(username: string): void {
  //   this.storage.set('username', username);
  // };
  //
  // getUsername(): Promise<string> {
  //   return this.storage.get('username').then((value) => {
  //     return value;
  //   });
  // };
  //
  // hasLoggedIn(): Promise<boolean> {
  //   return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
  //     return value === true;
  //   });
  // };
  //
  // checkHasSeenTutorial(): Promise<string> {
  //   return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
  //     return value;
  //   });
  // };
}
