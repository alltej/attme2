import {Attendee} from "./attendee.interface";

export interface IEvent {
  key: string;
  description: string;
  name: string;
  when: string;
  where:string;
  //tags: string[];
  likes: number;
  comments: number;
  attendeesCount: number;
  isLiked:boolean;
  //attendees: Attendee[];
}
