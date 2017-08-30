import {Attendee} from "./attendee.interface";

export class Event {
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
