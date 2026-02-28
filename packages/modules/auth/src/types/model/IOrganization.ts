import IOrganizationMember from './IOrganizationMember'

export default interface IOrganization {
  id: number
  name: string
  slug: string
  brandingConfig?: Record<string, any> | null
  securityPolicies?: Record<string, any> | null
  description?: string | null
  logoUrl?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  members?: Array<IOrganizationMember>
}
