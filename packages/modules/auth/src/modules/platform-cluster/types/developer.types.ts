/**
 * Developer Platform Types for Auth Module
 * Defines Application, Scope, and API entities
 */

export type ApplicationType = 'native' | 'web' | 'spa' | 'service' | 'saml'

export interface AuthApplication {
  id: string
  name: string
  clientId: string
  clientSecretHint?: string // e.g. "x1a...4v2"
  type: ApplicationType
  status: 'active' | 'suspended' | 'development'
  logoUrl?: string
  description?: string

  // OIDC Specific
  redirectUris?: string[]
  postLogoutRedirectUris?: string[]
  grantTypes?: ('authorization_code' | 'implicit' | 'refresh_token' | 'client_credentials')[]

  // SAML Specific
  entityId?: string
  acsUrl?: string

  ownerId: string // User who created the app
  createdAt: string
  updatedAt: string
}

export interface AuthScope {
  id: string
  name: string // e.g., 'profile', 'email', 'custom:finance'
  displayName: string
  description: string
  isSystem: boolean // Whether it's a built-in OIDC scope
  permissionsMapping: string[] // List of permission IDs from governance registry
}

export interface APIEndpoint {
  id: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  summary: string
  description?: string
  requiredScopes: string[]
  isPublic: boolean
}
