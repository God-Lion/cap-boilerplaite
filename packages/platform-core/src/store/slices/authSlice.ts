import { StateCreator } from 'zustand'
import { fetchClient, ENDPOINTS } from '../../services/api/api.client'
import { IAuth, ILogin } from '../../types'
import { IResponse } from '../../types'
import { secureTokenManager, TokenData as AuthTokens } from '../../services/secureTokenManager'
import { AppStore } from '..'

export type { AuthTokens }

export interface AuthSlice {
  user: IAuth | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  tokens: AuthTokens | null

  signIn: (credentials: ILogin) => Promise<void>
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

export const createAuthSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/persist', unknown]],
  [],
  AuthSlice
> = (set, get) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
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
      const response = await fetchClient.post<IResponse>(ENDPOINTS.auth.login, credentials)

      if (response.status === 200 && response.data) {
        // Fetch user data after successful login
        await get().refreshAuth()
      }
    } catch (error: any) {
      set((state: AuthSlice) => {
        state.isLoading = false
        state.error = error.response?.data?.message || 'Sign in failed'
        state.isAuthenticated = false
      })
      throw error
    }
  },

  // Sign Out
  signOut: async (callback?: (status: number) => void) => {
    try {
      const response = await fetchClient.get(ENDPOINTS.auth.logout)

      set((state: AuthSlice) => {
        state.user = null
        state.isAuthenticated = false
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

      // Only require accessToken — refreshToken is stored as HttpOnly cookie
      if (!tokens || !tokens.accessToken) {
        console.log('[refreshAuth] No access token found. clearing state.')
        set((state: AuthSlice) => {
          state.user = null
          state.isAuthenticated = false
          state.isLoading = false
          state.error = 'No valid session'
        })
        return
      }

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
              refreshToken: response.data.refresh_token || tokens.refreshToken,
              expiresAt: Date.now() + (response.data.expires_in || 3600) * 1000,
            }
            secureTokenManager.setTokens(newTokens)
          }

          // Set user data - backend might return user data directly or in a 'user' field
          const userData = response.data.user || response.data

          set((state: AuthSlice) => {
            state.user = userData
            state.isAuthenticated = true
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

  // Refresh Token (get new access token using refresh token)
  // This is kept for backward compatibility but is now handled by fetch interceptor
  refreshToken: async () => {
    try {
      const tokens = secureTokenManager.getTokens()

      if (!tokens || !tokens.refreshToken) {
        throw new Error('No refresh token available')
      }

      interface RefreshResponse {
        access_token: string
        refresh_token: string
        token?: string
        expires_in: number
      }

      const response = await fetchClient.post<RefreshResponse>(
        '/api/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${tokens.refreshToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      const accessToken = response.data.access_token || response.data.token
      const refreshToken = response.data.refresh_token || tokens.refreshToken
      const expiresIn = response.data.expires_in || 3600

      if (!accessToken) {
        throw new Error('No access token in response')
      }

      const expiresAt = Date.now() + expiresIn * 1000

      const newTokens: AuthTokens = {
        accessToken,
        refreshToken,
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
    set((state: AuthSlice) => {
      state.user = user
      state.isAuthenticated = user !== null
      state.error = null

      // Check if user object contains tokens and persist them
      if (user && (user.token || user.refreshToken)) {
        const tokens: AuthTokens = {
          accessToken: user.token || '',
          refreshToken: user.refreshToken || '',
          expiresAt: Date.now() + 3600 * 1000, // Default 1h
        }
        state.tokens = tokens

        // Use persist preference if available in user object or default to true
        const persist = (user as any).rememberMe !== false
        secureTokenManager.setTokens(tokens, persist)
      } else if (!user) {
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
