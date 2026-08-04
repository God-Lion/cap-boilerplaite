import { StateCreator } from 'zustand'
import type { AppStore } from '../../types'
import { fetchClient, ENDPOINTS } from '../../services/api/api.client'
import { IAuth, ILogin, hasAdminRole, normalizeRole } from '@cap/shared-types'
import { secureTokenManager, TokenData as AuthTokens } from '../../services/secureTokenManager'

export type { AuthTokens }

export interface AuthSlice {
  user: IAuth | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  tokens: AuthTokens | null

  signIn: (credentials: ILogin) => Promise<any>
  signOut: (callback?: (status: number) => void) => Promise<void>
  refreshAuth: () => Promise<void>
  refreshToken: () => Promise<string>
  updateUser: (userData: Partial<IAuth>) => void
  setUser: (user: IAuth | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

// Singleton promise to prevent duplicate refreshAuth calls
let refreshAuthPromise: Promise<void> | null = null

const normalizeUserData = (userData: any) => {
  if (!userData || typeof userData !== 'object') return userData

  const normalized = { ...userData }

  if (normalized.role && typeof normalized.role === 'object') {
    normalized.roleObject = normalized.roleObject || normalized.role
    normalized.roleName =
      normalized.roleName || normalized.role.slug || normalized.role.name || normalized.role.value
  }

  const resolvedRole =
    normalizeRole(normalized.role) ||
    normalizeRole(normalized.roleObject) ||
    normalizeRole(normalized.roleName)

  if (resolvedRole) {
    normalized.role = resolvedRole
  }

  if (normalized.avatar && !normalized.avatarUrl) {
    normalized.avatarUrl = normalized.avatar
  }

  if (normalized.avatarUrl && !normalized.avatar) {
    normalized.avatar = normalized.avatarUrl
  }

  if (!Array.isArray(normalized.permissions)) {
    normalized.permissions = []
  }

  return normalized
}

export const createAuthSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/persist', unknown]],
  [],
  AuthSlice
> = (set, _get) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  error: null,
  tokens: null,

  // Sign In
  signIn: async (credentials: ILogin) => {
    set((state: AuthSlice) => {
      state.isLoading = true
      state.error = null
    })

    try {
      const response = await fetchClient.post<any>(ENDPOINTS.auth.login, credentials)

      if (response.status === 200 && response.data) {
        // Set user data - backend might return user data directly or in a 'user' field
        let userData = normalizeUserData(response.data.user || response.data)
        const token = response.data.accessToken || response.data.token
        
        // Update user object with token if present but missing in user data
        if (token && userData && !userData.token) {
          userData.token = token
        }

        // Add rememberMe preference for secureTokenManager persistence
        if (userData) {
          userData.rememberMe = credentials.rememberMe
        }

        console.log('[signIn] Login successful, updating user state atomically')

        // CRITICAL: Update state atomically to prevent refreshAuth race condition
        set((state: AuthSlice) => {
          state.user = userData
          state.isAuthenticated = true
          state.isAdmin = hasAdminRole(userData?.role) || hasAdminRole(userData?.roleObject) || hasAdminRole(userData?.roleName)
          state.tokens = token ? { accessToken: token, expiresAt: Date.now() + 3600 * 1000 } : null
          state.isLoading = false
          state.error = null
        })

        // Persist tokens in secureTokenManager
        if (token) {
          secureTokenManager.setTokens({
            accessToken: token,
            expiresAt: Date.now() + 3600 * 1000,
          })
        }

        return response
      }
    } catch (error: any) {
      console.error('[signIn] Error:', error.response?.status, error.message)
      set((state: AuthSlice) => {
        state.error = error.response?.data?.message || 'Sign in failed'
        state.isAuthenticated = false
        state.isLoading = false
      })
      throw error
    }
  },

  // Sign Out
  signOut: async (callback?: (status: number) => void) => {
    try {
      const response = await fetchClient.post(ENDPOINTS.auth.logout)

      set((state: AuthSlice) => {
        state.user = null
        state.isAuthenticated = false
        state.isAdmin = false
        state.tokens = null
        state.error = null
      })

      secureTokenManager.clearTokens()

      if (callback) callback(response.status)
    } catch (error) {
      console.error('Sign out error:', error)
      set((state: AuthSlice) => {
        state.user = null
        state.isAuthenticated = false
        state.tokens = null
      })

      secureTokenManager.clearTokens()
    } finally {
      set((state: AuthSlice) => {
        state.isLoading = false
      })
    }
  },

  // Refresh Auth (check session and get user data)
  refreshAuth: async () => {
    // Return existing promise if refresh is already in progress
    if (refreshAuthPromise) {
      return refreshAuthPromise
    }

    refreshAuthPromise = (async () => {
      // Ensure token manager is initialized
      console.log('[refreshAuth] Waiting for SecureTokenManager initialization...')
      await secureTokenManager.ensureInitialized()
      console.log('[refreshAuth] SecureTokenManager initialized')

      // Check if we have tokens first
      const tokens = secureTokenManager.getTokens()
      console.log('[refreshAuth] Tokens found:', !!tokens)

      // Removed premature token check. `secureTokenManager` is in-memory only, so tokens will always be null on a hard reload.
      // We must let `fetchClient` execute the `/api/auth/session` call so it triggers a 401, which then triggers the interceptor's `/api/auth/refresh` call using the HttpOnly cookie.


      set((state: AuthSlice) => {
        state.isLoading = true
        state.error = null
      })

      try {
        // Call session endpoint to get current user data
        // The refresh token is sent automatically via HttpOnly cookie
        const response = await fetchClient.get<any>(ENDPOINTS.auth.session)

        if (response.status === 200 && response.data) {
          // Update tokens if provided in response
          if (response.data.access_token || response.data.token) {
            const newTokens: AuthTokens = {
              accessToken: response.data.access_token || response.data.token,
              expiresAt: Date.now() + (response.data.expires_in || 3600) * 1000,
            }
            secureTokenManager.setTokens(newTokens)
          }

          // Set user data - backend might return user data directly or in a 'user' field
          let userData = normalizeUserData(response.data.user || response.data)

          set((state: AuthSlice) => {
            state.user = userData
            state.isAuthenticated = true
            state.isAdmin = hasAdminRole(userData?.role) || hasAdminRole(userData?.roleObject) || hasAdminRole(userData?.roleName)
            state.isLoading = false
            state.error = null
          })
        }
      } catch (error: any) {
        console.error('[refreshAuth] Error:', error.response?.status, error.message)

        set((state: AuthSlice) => {
          state.user = null
          state.isAuthenticated = false
          state.isLoading = false
          state.error = error.response?.data?.message || 'Session expired'
        })

        // Clear tokens on failure
        secureTokenManager.clearTokens()
      } finally {
        refreshAuthPromise = null
      }
    })()

    return refreshAuthPromise
  },

  // Refresh Token (get new access token via HttpOnly cookie)
  refreshToken: async () => {
    try {
      interface RefreshResponse {
        access_token: string
        token?: string
        expires_in: number
      }

      // Refresh token is sent automatically via HttpOnly cookie (credentials: 'include')
      const response = await fetchClient.post<RefreshResponse>('/api/auth/refresh')

      const accessToken = response.data.access_token || response.data.token
      const expiresIn = response.data.expires_in || 3600

      if (!accessToken) {
        throw new Error('No access token in response')
      }

      const expiresAt = Date.now() + expiresIn * 1000

      const newTokens: AuthTokens = {
        accessToken,
        expiresAt,
      }

      secureTokenManager.setTokens(newTokens)

      set((state: AuthSlice) => {
        state.tokens = newTokens
      })

      return accessToken
    } catch (error: any) {
      console.error('[refreshToken] Error:', error)

      set((state: AuthSlice) => {
        state.user = null
        state.isAuthenticated = false
        state.tokens = null
        state.error = 'Token refresh failed'
      })

      secureTokenManager.clearTokens()
      throw error
    }
  },

  // Update User
  updateUser: (userData: Partial<IAuth>) => {
    set((state: AuthSlice) => {
      if (state.user) {
        state.user = { ...state.user, ...userData }
      }
    })
  },

  // Set User (directly set user data, e.g., after login)
  setUser: (user: IAuth | null) => {
    const normalizedUser = normalizeUserData(user)

    set((state: AuthSlice) => {
      state.user = normalizedUser
      state.isAuthenticated = normalizedUser !== null
      state.isAdmin =
        normalizedUser !== null &&
        (hasAdminRole(normalizedUser.role) ||
          hasAdminRole(normalizedUser.roleObject) ||
          hasAdminRole(normalizedUser.roleName))
      state.error = null

      // Check if user object contains access token and persist in memory
      if (normalizedUser && (normalizedUser as any).token) {
        const tokens: AuthTokens = {
          accessToken: (normalizedUser as any).token || '',
          expiresAt: Date.now() + 3600 * 1000, // Default 1h
        }
        state.tokens = tokens

        secureTokenManager.setTokens(tokens)
      } else if (!normalizedUser) {
        state.tokens = null
        secureTokenManager.clearTokens()
      }
    })
  },

  // Clear Error
  clearError: () => {
    set((state: AuthSlice) => {
      state.error = null
    })
  },

  // Set Tokens
  setTokens: (tokens: AuthTokens | null) => {
    set((state: AuthSlice) => {
      state.tokens = tokens
    })

    if (tokens) {
      secureTokenManager.setTokens(tokens)
    } else {
      secureTokenManager.clearTokens()
    }
  },

  // Set Loading
  setLoading: (loading: boolean) => {
    set((state: AuthSlice) => {
      state.isLoading = loading
    })
  },
})
