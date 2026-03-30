export interface TokenData {
  accessToken: string
  // Refresh token is now handled via HttpOnly cookie, but kept for legacy compatibility
  refreshToken?: string
  expiresAt: number
}

class SecureTokenManager {
  private accessToken: string | null = null
  private expiresAt: number | null = null
  // Always initialized as we don't load from storage
  // Debug: unique instance ID to detect multiple instances
  private readonly instanceId = Math.random().toString(36).substring(7)

  constructor() {
    console.log(`[SecureTokenManager] Instance created: ${this.instanceId}`)
  }

  /**
   * Initialize tokens - No-op now as we don't load from storage
   */
  async init(): Promise<void> {
    return
  }

  /**
   * Ensure tokens are initialized - No-op
   */
  async ensureInitialized(): Promise<void> {
    return
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  getExpiresAt(): number | null {
    return this.expiresAt
  }

  getTokens(): TokenData | null {
    // Require access token to consider valid
    if (!this.accessToken) {
      return null
    }

    return {
      accessToken: this.accessToken,
      expiresAt: this.expiresAt || 0,
    }
  }

  async setTokens(tokens: TokenData, _persist?: boolean): Promise<void> {
    console.log(`[SecureTokenManager:${this.instanceId}] setTokens called:`, {
      accessToken: tokens.accessToken?.substring(0, 20) + '...',
      expiresAt: tokens.expiresAt,
    })
    this.accessToken = tokens.accessToken
    this.expiresAt = tokens.expiresAt
  }

  async setAccessToken(token: string): Promise<void> {
    this.accessToken = token
  }

  async setExpiresAt(expiresAt: number): Promise<void> {
    this.expiresAt = expiresAt
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null
    this.expiresAt = null
  }

  isTokenExpired(): boolean {
    if (!this.expiresAt) return true
    if (!this.accessToken) return true

    const now = Date.now()
    const bufferTime = 5 * 60 * 1000 // 5 minutes buffer

    return now >= this.expiresAt - bufferTime
  }

  hasTokens(): boolean {
    return this.accessToken !== null
  }

  isInitialized(): boolean {
    return true
  }
}

export const secureTokenManager = new SecureTokenManager()

export default secureTokenManager
