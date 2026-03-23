export interface JWKSKey {
  kid: string
  kty?: string
  use?: string
  alg?: string
  n?: string
  e?: string
  status?: 'active' | 'standby' | 'revoked'
  created?: string
  expires?: string
  health?: number
}

export interface JWKSKeyDetail extends JWKSKey {
  updated: string
  publicJwk?: Record<string, unknown>
  metadata?: Record<string, unknown> | null
}

export interface CreateJWKSKeyRequest {
  kid: string
  privateKey?: string
  publicKey?: string
  algorithm?: string
  use?: string
  status?: 'active' | 'standby' | 'revoked'
  expiresAt?: string
}

export interface JWKSKeyRotationResponse {
  oldKey: JWKSKey
  newKey: JWKSKey
  rotatedAt: string
}
