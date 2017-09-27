import { Injectable } from '@angular/core';
import {ItemsProvider} from "./items-provider";
import {IComment} from "../../models/comment.interface";



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
}
