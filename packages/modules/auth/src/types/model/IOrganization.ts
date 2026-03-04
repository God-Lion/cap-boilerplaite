import type IOrganizationMember from './IOrganizationMember'

export default interface IOrganization {
  id: number
  name: string
  slug: string
  domain: string | null
  support_email?: string | null
  status: string
  logo_url: string | null
  domainVerifications?: { id: number; domain: string; status: string; verified_at: string }[]
  members_count?: number
  members?: Array<IOrganizationMember>
  brandingConfig?: {
    primaryColor?: string
    secondaryColor?: string
    logo_url?: string
    [key: string]: unknown
  } | null
  securityPolicies?: {
    enforceMfa?: boolean
    ssoOnly?: boolean
    allowPublicSignup?: boolean
    [key: string]: unknown
  } | null
  created_at: string
  updated_at: string
}
