export interface IUser {
  uid: string
  username: string
}


export interface IOrganization {
  oid: string
  name: string
}


export interface IUserOrgs {
  oid: string
  name: string
  role: number
}

// this.dataSvc.usersRef.child(newUser.uid)
//   .child("profile").set({
//   lastname:member.lastname,
//   firstname:member.firstname,
//   email: member.email,
//   verified: false
// });
//
// this.dataSvc.usersRef.child(newUser.uid)
//   .child("organizations").set({
//   name:member.lastname,
//   role:roleId
// });


export interface INewUserMember {
  profile: IUserProfile
  organizations: IUserOrgs[]
}

export interface IUserProfile {
  lastname: string
  firstname: string
  birthDate: string
  email: string
  name: string
}
