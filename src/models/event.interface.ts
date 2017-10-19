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
  attendees: number;
  isLiked:boolean;
  likedBy: ILikedBy[]
  //attendees: Attendee[];
}

export interface INewEvent {
  key: string;
  description: string;
  name: string;
  when: string;
  where:string;
  //attendees: Attendee[];
}

export interface ILikedBy {
  key?: string;
  name: string
}
