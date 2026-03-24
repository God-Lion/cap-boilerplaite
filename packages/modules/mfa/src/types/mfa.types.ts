import { User } from '@cap/module-auth'

export interface MfaSetupRequest {
  method: 'totp' | 'sms' | 'email'
}

export interface TotpConfirmEnrollmentRequest {
  code: string
}

export interface MfaVerifyRequest {
  code: string
  secret?: string
  remember_device?: boolean
}

export interface MfaLoginVerifyRequest {
  userId: number
  code: string
}

export interface MfaSetupResponse {
  secret?: string
  qrCode?: string
  qr_code_url: string
  url?: string
  backup_codes: Array<string>
  method: string
}

export interface TotpEnrollmentResponse {
  qrDataUrl: string
  manualEntry: string
}

export interface TotpConfirmEnrollmentResponse {
  enrolled: boolean
  recoveryCodes: string[]
  message: string
}

export interface MfaVerifyResponse {
  token: string
  refresh_token: string
  user: User
  expires_in: number
}

export interface MfaStatusResponse {
  enabled: boolean
  method?: 'totp' | 'sms' | 'email'
  backup_codes_remaining?: number
}
