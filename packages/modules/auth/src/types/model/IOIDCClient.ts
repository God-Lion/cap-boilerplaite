import IOIDCClientBranding from './IOIDCClientBranding'

export default interface IOIDCClient {
  id: number
  clientId: string
  clientSecret?: string
  name: string
  redirectUris: Array<string>
  grantTypes: Array<string>
  responseTypes: Array<string>
  isActive: boolean
  branding?: IOIDCClientBranding | null
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}
