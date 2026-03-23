export default interface ISessionLog {
  id: number
  userId: number
  token?: string
  ipAddress?: string | null
  userAgent?: string | null
  city?: string | null
  country?: string | null
  countryCode?: string | null
  loginAt?: string | null
  loginSuccessful: boolean
  logoutAt?: string | null
  forceLogout?: boolean
  lastTouchedAt?: string | null
  isRememberSession?: boolean
  version?: number
  isActive?: boolean
  isTerminated?: boolean
  location?: string
  browser?: string
  deviceInfo?: string
  createdAt?: string
  updatedAt?: string
}
