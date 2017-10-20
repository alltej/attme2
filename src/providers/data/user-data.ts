import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import {IOrganization} from "../../models/user.interface";
import { Storage } from '@ionic/storage';

@Injectable()
export class UserData {
  currentOoId: string;
  private _organizations: Array<IOrganization>;
  public  ooid: string

  constructor(
    public events: Events,
    public storage: Storage) {
  }


  setCurrentOOID(ooid: string): void {
    console.log(`setCurrentOOID==${ooid}`)
    this.storage.set('currentOOID', ooid);
    this.currentOoId=ooid;
    //this.storage.setItem('ooid', sessionName);
  };

  getCurrentOOID(): string {
    //return Promise.resolve("-KwCMJMRwy57wGWfVfry");
    //return this.currentOoId; //"-KwCMJMRwy57wGWfVfry"
    this.storage.get('currentOOID').then((value) => {
      this.currentOoId = value;
    });
    if (this.currentOoId == null) {
      //TODO: Need to set a default on Login
      console.log('TODO: Need to set a default on Login')
      this.currentOoId = "-KwCMJMRwy57wGWfVfry"
    }
    return this.currentOoId;
    //
    // return this.storage.getItem('ooid').then((value) => {
    //   return value;
    // });
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
