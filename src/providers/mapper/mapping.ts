import { Injectable } from '@angular/core';
import {ItemsProvider} from "./items-provider";
import {IComment} from "../../models/comment.interface";
import {IEvent} from "../../models/event.interface";
import {IMember} from "../../models/member.interface";
import {IOrganization, IUserOrgs} from "../../models/user.interface";



@Injectable()
export class MappingProvider {

  constructor(private itemsService: ItemsProvider) { }

  getComments(snapshot: any): Array<IComment> {
    //console.log('getComments')
    let comments: Array<IComment> = [];
    if (snapshot.val() == null)
      return comments;

    let list = snapshot.val();

    Object.keys(snapshot.val()).map((key: any) => {
      let comment: any = list[key];
      //console.log(`comment==${comment}`);
      this.itemsService.groupByBoolean(comment.votes, true);

      comments.push({
        key: key,
        text: comment.text,
        event: comment.eventId,
        dateCreated: comment.dateCreated,
        user: comment.user,
        votesUp: this.itemsService.groupByBoolean(comment.votes, true),
        votesDown: this.itemsService.groupByBoolean(comment.votes, false)
      });
    });

    return comments;
  }

  getComment(snapshot: any, commentKey: string): IComment {
    let comment: IComment;

    if (snapshot.val() == null)
      return null;

    let snapshotComment = snapshot.val();
    //console.log(snapshotComment);
    comment = {
      key: commentKey,
      text: snapshotComment.text,
      event: snapshotComment.eventId,
      dateCreated: snapshotComment.dateCreated,
      user: snapshotComment.user,
      votesUp: this.itemsService.groupByBoolean(snapshotComment.votes, true),
      votesDown: this.itemsService.groupByBoolean(snapshotComment.votes, false)
    };

    return comment;
  }

  getEvents(snapshot: any): Array<IEvent> {
    //console.log(`mapping::getEvents::${snapshot.val()}`)
    let iEvents: Array<IEvent> = [];
    if (snapshot.val() == null)
      return iEvents;

    let list = snapshot.val();

    Object.keys(snapshot.val()).map((key: any) => {
      let anEvent: any = list[key];
      //console.log(`mapping::getEvents::key::${key}:name:${anEvent}`)
      iEvents.push({
        key: key,
        name: anEvent.name,
        description: anEvent.description,
        when: anEvent.when,
        where: anEvent.where,
        likes: (anEvent.stats != null)?anEvent.stats.likes:0,
        comments: (anEvent.stats != null)?anEvent.stats.comments:0, //anEvent.stats.comments,
        attendees: (anEvent.stats != null)?anEvent.stats.attendees:0, //anEvent.stats.attendees,
        isLiked: false, //TODO,
        likedBy: anEvent.likedBy
      });
    });

    return iEvents;
  }

  getEvent(snapshot: any, key: string): IEvent {

    let anEvent: IEvent = {
      key: key,
      name: snapshot.name,
      description: snapshot.description,
      when: snapshot.when,
      where: snapshot.where,
      likes: snapshot.likes,
      comments: snapshot.comments,
      attendees: snapshot.attendees,
      isLiked: false, //TODO
      likedBy: snapshot.likedBy
    };

    return anEvent;
  }



  getMembers(snapshot: any): Array<IMember> {
    //console.log(`mapping::getMembers::${snapshot.val()}`)
    let iMembers: Array<IMember> = [];
    if (snapshot.val() == null)
      return iMembers;

    let list = snapshot.val();

    Object.keys(snapshot.val()).map((key: any) => {
      let aMember: any = list[key];
      console.log(`mappings::aMember::${aMember}`)
      iMembers.push({
        uid: aMember.uid,
        memberKey: aMember.memberKey,
        email: aMember.email,
        birthDate: aMember.birthDate,
        firstname: aMember.firstname,
        lastname: aMember.lastname,
        memberId: aMember.memberId,
        photoUrl: aMember.photoUrl,
        textAvatar: aMember.textAvatar,
        isMyCircle: false //TODO
      });
    });

    return iMembers;
  }


  getUserOrgs(snapshot: any): Array<IUserOrgs> {
    //console.log(`mapping::getEvents::${snapshot.val()}`)
    let orgs: Array<IUserOrgs> = [];
    if (snapshot.val() == null)
      return orgs;

    let list = snapshot.val();

    Object.keys(snapshot.val()).map((key: any) => {
      let org: any = list[key];
      //console.log(`mapping::getOrganizations::key::${key}:name:${org}`)
      orgs.push({
        oid: key,
        name: org.name,
        role: org.role
      });
    });

    return orgs;
  }
}
