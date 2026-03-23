export interface SAMLConfig {
  id?: number
  name?: string
  entityId: string
  ssoUrl: string
  sloUrl?: string
  acsUrl?: string
  certificate: string
  nameIdFormat?: string
  wantAssertionsSigned?: boolean
  wantResponseSigned?: boolean
  enabled?: boolean
  isActive?: boolean
  attributeMapping?: Record<string, string> | null
}

export interface SAMLMetadata {
  entityId: string
  name?: string
  ssoUrl: string
  sloUrl?: string
  certificate: string
  wantAssertionsSigned?: boolean
  wantResponseSigned?: boolean
}
