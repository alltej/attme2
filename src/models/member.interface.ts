export interface IMember {
  uid: string;
  memberKey: string;
  email: string;
  birthDate: string;
  firstname: string;
  lastname: string;
  memberId: string;
  photoUrl: string;
  isMyCircle: boolean;
}

export interface INewMember {
  uid: string;
  memberKey: string;
  email: string;
  birthDate: string;
  firstName: string;
  lastName: string;
  memberId: string
}
