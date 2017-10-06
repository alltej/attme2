import { Injectable } from '@angular/core';
import {ItemsProvider} from "./items-provider";
import {IComment} from "../../models/comment.interface";
import {IEvent} from "../../models/event.interface";



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

  getEvents(snapshot: any): Array<IEvent> {
    //console.log(`mapping::getEvents::${snapshot.val()}`)
    let iEvents: Array<IEvent> = [];
    if (snapshot.val() == null)
      return iEvents;

    let list = snapshot.val();

    Object.keys(snapshot.val()).map((key: any) => {
      let anEvent: any = list[key];
      //console.log(`mapping::getEvents::key::${key}:name:${anEvent.when}`)
      iEvents.push({
        key: key,
        name: anEvent.name,
        description: anEvent.description,
        when: anEvent.when,
        where: anEvent.where,
        likes: anEvent.likes,
        comments: anEvent.comments,
        attendeesCount: snapshot.attendeesCount,
        isLiked: false //TODO
      });
    });

    return iEvents;
  }
}
