import IPermission from './IPermission'

export default interface IRole {
  id: number
  slug?: string | null
  organizationId?: number | null
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
  permissions?: Array<IPermission>
  permissionNames?: string[]
  usersCount?: number
  permissionsCount?: number
}
