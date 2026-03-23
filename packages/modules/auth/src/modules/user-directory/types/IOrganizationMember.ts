import IUser from './IUser'
import IOrganization from './IOrganization'
import IRole from "@auth/modules/authorization-engine/types/IRole"

export default interface IOrganizationMember {
  id: number
  organizationId: number
  userId: number
  roleId: number
  isOwner?: boolean
  createdAt?: string
  updatedAt?: string
  user?: IUser
  role?: IRole
  organization?: IOrganization
}


