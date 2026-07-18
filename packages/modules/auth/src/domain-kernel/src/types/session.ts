import type { UserId, SessionId } from './identifiers'

export type SessionStatus = 'active' | 'expired' | 'revoked'

export interface Session {
  id: SessionId
  userId: UserId
  status: SessionStatus
  createdAt: string
  expiresAt: string
  lastAccessedAt?: string
  ipAddress?: string
  userAgent?: string
  deviceInfo?: {
    os?: string
    browser?: string
    deviceType?: 'desktop' | 'mobile' | 'tablet'
  }
}

export interface SessionLog {
  id: string
  userId: UserId
  sessionId?: SessionId
  action: 'login' | 'logout' | 'mfa_challenge' | 'password_changed' | 'session_revoked'
  ipAddress?: string
  userAgent?: string
  success: boolean
  timestamp: string
  metadata?: Record<string, unknown>
}
