import { localStorageManager } from './storage'

export interface TokenData {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const TOKEN_STORAGE_KEY = 'god-lion-auth-tokens'

class SecureTokenManager {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private expiresAt: number | null = null
  private initialized = false

  constructor() {
    // Initialize tokens from storage
    this.init()
  }

  /**
   * Initialize tokens from storage
   */
  async init(): Promise<void> {
    if (this.initialized) return
    await this.loadFromStorage()
  }

  /**
   * Load tokens from localStorage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      // Use encryption for token storage
      const storedTokens = await localStorageManager.get<TokenData>(TOKEN_STORAGE_KEY, true)

      if (storedTokens) {
        // Validate token structure
        if (storedTokens.accessToken && storedTokens.refreshToken && storedTokens.expiresAt) {
          this.accessToken = storedTokens.accessToken
          this.refreshToken = storedTokens.refreshToken
          this.expiresAt = storedTokens.expiresAt

          if ((import.meta as any).env?.DEV) {
            console.log('[SecureTokenManager] Tokens loaded from storage')
          }
        }
      }
    } catch (error) {
      console.error('[SecureTokenManager] Failed to load tokens from storage:', error)
      // Clear potentially corrupted data
      await this.clearStorage()
    } finally {
      this.initialized = true
    }
  }

  /**
   * Save tokens to localStorage
   */
  private async saveToStorage(): Promise<void> {
    try {
      if (this.accessToken && this.refreshToken && this.expiresAt) {
        const tokens: TokenData = {
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
          expiresAt: this.expiresAt,
        }

        // Use encryption for token storage
        await localStorageManager.set(TOKEN_STORAGE_KEY, tokens, true)

        if ((import.meta as any).env?.DEV) {
          console.log('[SecureTokenManager] Tokens saved to storage')
        }
      }
    } catch (error) {
      console.error('[SecureTokenManager] Failed to save tokens to storage:', error)
    }
  }

  /**
   * Clear tokens from localStorage
   */
  private async clearStorage(): Promise<void> {
    try {
      localStorageManager.remove(TOKEN_STORAGE_KEY)

      if ((import.meta as any).env?.DEV) {
        console.log('[SecureTokenManager] Tokens cleared from storage')
      }
    } catch (error) {
      console.error('[SecureTokenManager] Failed to clear tokens from storage:', error)
    }
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  getExpiresAt(): number | null {
    return this.expiresAt
  }

  getTokens(): TokenData | null {
    if (!this.accessToken || !this.refreshToken || !this.expiresAt) {
      return null
    }

    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresAt: this.expiresAt,
    }
  }

  async setTokens(tokens: TokenData): Promise<void> {
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken
    this.expiresAt = tokens.expiresAt

    // Persist to storage
    await this.saveToStorage()
  }

  async setAccessToken(token: string): Promise<void> {
    this.accessToken = token

    // Persist to storage if we have all required data
    if (this.refreshToken && this.expiresAt) {
      await this.saveToStorage()
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    this.refreshToken = token

    // Persist to storage if we have all required data
    if (this.accessToken && this.expiresAt) {
      await this.saveToStorage()
    }
  }

  async setExpiresAt(expiresAt: number): Promise<void> {
    this.expiresAt = expiresAt

    // Persist to storage if we have all required data
    if (this.accessToken && this.refreshToken) {
      await this.saveToStorage()
    }
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null
    this.refreshToken = null
    this.expiresAt = null

    // Clear from storage
    await this.clearStorage()
  }

  isTokenExpired(): boolean {
    if (!this.expiresAt) return true

    const now = Date.now()
    const bufferTime = 5 * 60 * 1000 // 5 minutes buffer

    return now >= this.expiresAt - bufferTime
  }

  hasTokens(): boolean {
    return this.accessToken !== null && this.refreshToken !== null
  }

  /**
   * Check if tokens are initialized (loaded from storage)
   */
  isInitialized(): boolean {
    return this.initialized
  }
}

export const secureTokenManager = new SecureTokenManager()

export default secureTokenManager
