/**
 * Enhanced Auth Security Service
 *
 * ⚠️ IMPORTANT: This is CLIENT-SIDE rate limiting for UX purposes only.
 * It can be bypassed and should NOT be relied upon for security.
 *
 * ALWAYS implement rate limiting on the BACKEND.
 */

export interface FailedLoginAttempt {
  email: string
  timestamp: number
  ip?: string
  device?: string
  userAgent?: string
}

export interface LoginSecurity {
  attempts: number
  lastAttempt: number
  lockedUntil: number | null
  requiresCaptcha: boolean
  lockoutLevel: number
  alertSent: boolean
}

export interface RateLimitConfig {
  attempts: number[]
  lockouts: number[]
  captchaThreshold: number
  alertThreshold: number
  resetWindow: number
}

// ... imports

class EnhancedAuthSecurityService {
  // Backend now handles rate limiting.
  // This service is kept for compatibility and password strength validation.

  configure(): void {
    // No-op
  }

  getSecurityData(_email: string): LoginSecurity {
    return this.getDefaultSecurity()
  }

  recordFailedAttempt(_email: string): LoginSecurity {
    // Backend handles tracking.
    return this.getDefaultSecurity()
  }

  recordSuccessfulLogin(_email: string): void {
    // No-op
  }

  isAccountLocked(_email: string): {
    locked: boolean
    remainingTime?: number
    lockoutLevel?: number
  } {
    return { locked: false }
  }

  requiresCaptcha(_email: string): boolean {
    return false
  }

  unlockAccount(_email: string): void {
    // No-op
  }

  getLockoutTimeRemaining(_email: string): string {
    return ''
  }

  getSecurityStatus(_email: string): {
    attempts: number
    isLocked: boolean
    requiresCaptcha: boolean
    lockoutLevel: number
    remainingTime: string
    nextLockoutThreshold: number
  } {
    return {
      attempts: 0,
      isLocked: false,
      requiresCaptcha: false,
      lockoutLevel: 0,
      remainingTime: '',
      nextLockoutThreshold: 999,
    }
  }

  validatePasswordStrength(password: string): {
    isValid: boolean
    strength: 'weak' | 'medium' | 'strong' | 'very-strong'
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long')
    } else if (password.length >= 16) {
      score += 3
    } else if (password.length >= 12) {
      score += 2
    } else {
      score += 1
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Include at least one uppercase letter')
    } else {
      score += 1
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Include at least one lowercase letter')
    } else {
      score += 1
    }

    if (!/\d/.test(password)) {
      feedback.push('Include at least one number')
    } else {
      score += 1
    }

    // eslint-disable-next-line no-useless-escape
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Include at least one special character')
    } else {
      score += 2
    }

    const commonPatterns = [
      'password',
      '12345',
      'qwerty',
      'abc123',
      'letmein',
      'admin',
      'welcome',
      'monkey',
      '111111',
      'password1',
    ]
    if (commonPatterns.some((pattern) => password.toLowerCase().includes(pattern))) {
      feedback.push('Avoid common patterns like "password" or "12345"')
      score -= 3
    }

    if (/(.)\1{2,}/.test(password)) {
      feedback.push('Avoid repeating characters')
      score -= 1
    }

    let strength: 'weak' | 'medium' | 'strong' | 'very-strong'
    if (score >= 8) strength = 'very-strong'
    else if (score >= 6) strength = 'strong'
    else if (score >= 4) strength = 'medium'
    else strength = 'weak'

    return {
      isValid: feedback.length === 0 && score >= 4,
      strength,
      score: Math.max(0, score),
      feedback,
    }
  }

  private getDefaultSecurity(): LoginSecurity {
    return {
      attempts: 0,
      lastAttempt: 0,
      lockedUntil: null,
      requiresCaptcha: false,
      lockoutLevel: 0,
      alertSent: false,
    }
  }

  // Legacy methods kept for interface compatibility (no-ops)
  getFailedAttempts(): FailedLoginAttempt[] {
    return []
  }
  getFailedAttemptsForEmail(): FailedLoginAttempt[] {
    return []
  }
  getSecurityMetrics() {
    return {
      totalAccounts: 0,
      lockedAccounts: 0,
      accountsRequiringCaptcha: 0,
      recentFailedAttempts: 0,
    }
  }
  clearAllSecurityData(): void {}
  clearSecurityDataForEmail(): void {}
}

export const authSecurityService = new EnhancedAuthSecurityService()

export default authSecurityService
