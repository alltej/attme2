import {Attendee} from "./attendee.interface";

export interface IEvent {
  id: string;
  description: string;
  name: string;
  when: string;
  where:string;
  tags: string[];
  likes: number;
  isLiked:boolean;
  attendees: Attendee[];
}
