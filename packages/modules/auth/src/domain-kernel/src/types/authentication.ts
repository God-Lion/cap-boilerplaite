import type { UserId, TenantId } from './identifiers'

export type AuthFactor = 'password' | 'totp' | 'sms' | 'email' | 'passkey' | 'backup_code'

export interface TokenClaims {
  sub: UserId
  tid: TenantId
  scope: string[]
  exp: number
  iat?: number
  iss?: string
  aud?: string
  jti?: string
}

export interface AuthenticationResult {
  success: boolean
  userId?: UserId
  factors: AuthFactor[]
  requiresMfa: boolean
  mfaMethod?: AuthFactor
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}

export interface MfaChallenge {
  challengeId: string
  method: AuthFactor
  userId: UserId
  expiresAt: Date
  issuedAt: Date
}

export interface CredentialInfo {
  id: string
  type: 'password' | 'totp' | 'passkey' | 'sms' | 'email'
  createdAt: string
  lastUsedAt?: string
  name?: string
  verified: boolean
}
