export interface SCIMConfig {
  id?: number
  endpoint: string
  token: string
  isActive: boolean
  authMethod?: string
  userSchema?: string
  groupSchema?: string
  provisioningInterval?: number
  lastSyncAt?: string | null
}

export interface SCIMUser {
  id: string
  userName: string
  name?: {
    formatted?: string
    familyName?: string
    givenName?: string
  }
  emails?: Array<{ value: string; primary?: boolean }>
  active?: boolean
  groups?: Array<{ value: string; display?: string }>
}

export interface SCIMGroup {
  id: string
  displayName: string
  members?: Array<{ value: string; display?: string }>
}
