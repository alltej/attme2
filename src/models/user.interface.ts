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
