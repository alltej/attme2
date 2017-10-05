import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import {ItemsService} from "../items-service/item-service";
import {IUser} from "../../models/user.interface";
import {IMember} from "../../models/member.interface";
import {IEvent} from "../../models/event.interface";


@Injectable()
export class SqliteService {
  db: SQLite;

  constructor(private itemsService: ItemsService) {

  }

  InitDatabase() {
    let self = this;
    this.db = new SQLite();
    self.db.openDatabase({
      name: 'attmedb.db',
      location: 'default' // the location field is required
    }).then(() => {
      self.createEvents();
      //self.createComments();
      self.createMembers();
    }, (err) => {
      console.error('Unable to open database' +
        'se: ', err);
    });
  }

  resetDatabase() {
    let self = this;
    self.resetMembers();
    self.resetEvents();
    //self.resetComments();
  }

  resetMembers() {
    let self = this;
    let query = 'DELETE FROM Members';
    self.db.executeSql(query, {}).then((data) => {
      console.log('Users removed');
    }, (err) => {
      console.error('Unable to remove Members: ', err);
    });
  }

  resetEvents() {
    let self = this;
    let query = 'DELETE FROM Events';
    self.db.executeSql(query, {}).then((data) => {
      console.log('Events removed');
    }, (err) => {
      console.error('Unable to remove Events: ', err);
    });
  }

  resetComments() {
    let self = this;
    let query = 'DELETE FROM Comments';
    self.db.executeSql(query, {}).then((data) => {
      console.log('Comments removed');
    }, (err) => {
      console.error('Unable to remove Commments: ', err);
    });
  }

  printEvents() {
    let self = this;
    self.db.executeSql('SELECT * FROM Events', {}).then((data) => {
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i));
          console.log(data.rows.item(i).key);
          console.log(data.rows.item(i).name);
          console.log(data.rows.item(i).when);
          console.log(data.rows.item(i).where);
        }
      } else {
        console.log('no threads found..');
      }
    }, (err) => {
      console.error('Unable to print threads: ', err);
    });
  }

  createEvents() {
    let self = this;
    self.db.executeSql('CREATE TABLE IF NOT EXISTS Events ( key VARCHAR(255) PRIMARY KEY NOT NULL, attendeesCount int NULL, comments int NULL, description text NULL, likes int NULL, name text NOT NULL, when text NOT NULL, where text);', {}).then(() => {
    }, (err) => {
      console.error('Unable to create Events table: ', err);
    });
  }

  createComments() {
    let self = this;
    self.db.executeSql('CREATE TABLE IF NOT EXISTS Comments ( key VARCHAR(255) PRIMARY KEY NOT NULL, thread VARCHAR(255) NOT NULL, text text NOT NULL, USER VARCHAR(255) NOT NULL, datecreated text, votesUp INT NULL, votesDown INT NULL);', {}).then(() => {
    }, (err) => {
      console.error('Unable to create Comments table: ', err);
    });
  }

  // createUsers() {
  //   let self = this;
  //   self.db.executeSql('CREATE TABLE IF NOT EXISTS Users ( uid text PRIMARY KEY NOT NULL, username text NOT NULL); ', {}).then(() => {
  //   }, (err) => {
  //     console.error('Unable to create Users table: ', err);
  //   });
  // }

  createMembers() {
    let self = this;
    self.db.executeSql('CREATE TABLE IF NOT EXISTS Members ( uid text PRIMARY KEY NOT NULL, email text NOT NULL, firstName text NOT NULL, lastName text NOT NULL, memberId text NULL, photoUrl text NULL); ', {}).then(() => {
    }, (err) => {
      console.error('Unable to create Users table: ', err);
    });
  }

  saveUsers(members: IMember[]) {
    let self = this;

    members.forEach(member => {
      self.addMember(member);
    });
  }

  addMember(member: IMember) {
    let self = this;
    let query: string = 'INSERT INTO Members (uid, email, firstName, lastName, memberId, photoUrl) Values (?,?,?,?,?,?)';
    self.db.executeSql(query, [member.uid, member.email, member.firstName, member.lastName,member.memberId, member.photoUrl]).then((data) => {
      console.log('user ' + member.email + ' added');
    }, (err) => {
      console.error('Unable to add user: ', err);
    });
  }

  saveEvents(events: IEvent[]) {
    // let self = this;
    // let users: IUser[] = [];
    //
    // events.forEach(thread => {
    //   if (!self.itemsService.includesItem<IUser>(users, u => u.uid === thread.user.uid)) {
    //     console.log('in add user..' + thread.user.username);
    //     users.push(thread.user);
    //   } else {
    //     console.log('user found: ' + thread.user.username);
    //   }
    //   self.addThread(thread);
    // });
    //
    // self.saveUsers(users);
  }

  addThread(anEvent: IEvent) {
    let self = this;

    // let query: string = 'INSERT INTO Threads (key, title, question, category, datecreated, user, comments) VALUES (?,?,?,?,?,?,?)';
    // self.db.executeSql(query, [
    //   anEvent.key,
    //   anEvent.title,
    //   anEvent.question,
    //   anEvent.category,
    //   anEvent.dateCreated,
    //   anEvent.user.uid,
    //   anEvent.comments
    // ]).then((data) => {
    //   console.log('thread ' + anEvent.key + ' added');
    // }, (err) => {
    //   console.error('Unable to add thread: ', err);
    // });
  }

  getEvents(): any {
    // let self = this;
    // return self.db.executeSql('SELECT Threads.*, username FROM Threads INNER JOIN Users ON Threads.user = Users.uid', {});
  }
}
