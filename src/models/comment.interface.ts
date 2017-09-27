import {IUser} from "./user.interface";

export interface IComment {
  key?: string;
  thread: string;
  text: string;
  user: IUser;
  dateCreated: string;
  votesUp: number;
  votesDown: number;
}
