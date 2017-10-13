import { Injectable } from '@angular/core';
import {ItemsProvider} from "./items-provider";
import {IComment} from "../../models/comment.interface";
import {IEvent} from "../../models/event.interface";
import {IMember} from "../../models/member.interface";
import {IOrganization} from "../../models/user.interface";



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
      //console.log(comment.votes);
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
        likes: anEvent.likes,
        comments: anEvent.comments,
        attendeesCount: anEvent.attendeesCount,
        isLiked: false //TODO
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
      attendeesCount: snapshot.attendeesCount,
      isLiked: false //TODO
    };

    return anEvent;
  }



  getMembers(snapshot: any): Array<IMember> {
    //console.log(`mapping::getEvents::${snapshot.val()}`)
    let iMembers: Array<IMember> = [];
    if (snapshot.val() == null)
      return iMembers;

    let list = snapshot.val();

    Object.keys(snapshot.val()).map((key: any) => {
      let aMember: any = list[key];
      iMembers.push({
        uid: aMember.uid,
        memberKey: aMember.memberKey,
        email: aMember.email,
        birthDate: aMember.birthDate,
        firstName: aMember.firstName,
        lastName: aMember.lastName,
        memberId: aMember.memberId,
        photoUrl: aMember.photoUrl,
        isMyCircle: false //TODO
      });
    });

    return iMembers;
  }


  getOrganizations(snapshot: any): Array<IOrganization> {
    console.log(`mapping::getEvents::${snapshot.val()}`)
    let orgs: Array<IOrganization> = [];
    if (snapshot.val() == null)
      return orgs;

    let list = snapshot.val();

    Object.keys(snapshot.val()).map((key: any) => {
      let org: any = list[key];
      //console.log(`mapping::getOrganizations::key::${key}:name:${org}`)
      orgs.push({
        oid: key,
        name: org.name
      });
    });

    return orgs;
  }
}
