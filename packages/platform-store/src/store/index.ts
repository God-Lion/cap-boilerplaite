import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useEffect, useState } from 'react'
import encryption from '../services/encryption'

import { createAuthSlice, AuthSlice } from './slices/authSlice'
import { onTerminalError } from '../services/api/api.client'
import { createGuestSlice, GuestSlice } from './slices/guestSlice'
import { createProfileSlice, ProfileSlice } from './slices/profileSlice'
import { createNotificationSlice, NotificationSlice } from './slices/notificationSlice'
import { createPreferencesSlice, PreferencesSlice } from './slices/preferences/preferences'
import { createSettingsSlice, SettingsSlice, LayoutOverride } from './slices/settingsSlice'
import { createNavigationSlice, NavigationSlice } from './slices/navigationSlice'
import { createNetworkSlice, NetworkSlice } from './slices/networkSlice'
import { createOfflineQueueSlice, OfflineQueueSlice } from './slices/offlineQueueSlice'
import type { AppStore } from '../types'
export type { LayoutOverride, AppStore }

// Hydration tracking
let hasHydrated = false
const hydrationListeners: Set<() => void> = new Set()

export const getHasHydrated = () => hasHydrated

export const onHydrationComplete = (callback: () => void) => {
  if (hasHydrated) {
    callback()
    return () => {}
  }
  hydrationListeners.add(callback)
  return () => hydrationListeners.delete(callback)
}

const setHydrated = () => {
  hasHydrated = true
  hydrationListeners.forEach((cb) => cb())
  hydrationListeners.clear()
}

/**
 * Hook to check if Zustand store has been hydrated from async storage
 * Use this to wait before checking auth state
 */
export const useHasHydrated = () => {
  const [isHydrated, setHasHydratedState] = useState(hasHydrated)

  useEffect(() => {
    if (hasHydrated) {
      setHasHydratedState(true)
      return
    }
    const unsubscribe = onHydrationComplete(() => setHasHydratedState(true))
    return unsubscribe
  }, [])

  return isHydrated
}

/**
 * Custom Secure Storage for Zustand
 */
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = localStorage.getItem(name)
    if (!value) return null

    const storageKey = (import.meta as any).env?.VITE_STORAGE_KEY || 'cap-platform-storage'
    if (name === storageKey) {
      try {
        const masterKey = (import.meta as any).env?.VITE_STORAGE_ENCRYPTION_KEY
        if (!masterKey) {
          throw new Error('VITE_STORAGE_ENCRYPTION_KEY is not defined')
        }
        return await encryption.decryptData(value, masterKey)
      } catch (e) {
        if (import.meta.env.DEV) {
          console.warn('[secureStorage] Decryption failed, falling back to raw value', e)
        }
        return value
      }
    }
    return value
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const storageKey = (import.meta as any).env?.VITE_STORAGE_KEY || 'cap-platform-storage'
    if (name === storageKey) {
      const masterKey = (import.meta as any).env?.VITE_STORAGE_ENCRYPTION_KEY
      if (!masterKey) {
        throw new Error('VITE_STORAGE_ENCRYPTION_KEY is not defined')
      }
      const encrypted = await encryption.encryptData(value, masterKey)
      localStorage.setItem(name, encrypted)
    } else {
      localStorage.setItem(name, value)
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  },
}

/**
 * Main Application Store
 *
 * Uses Zustand with middleware for:
 * - Persistence (localStorage for auth, sessionStorage for guests)
 * - DevTools (Redux DevTools support)
 * - Immer (Immutable state updates)
 *
 * @see https://github.com/pmndrs/zustand
 */
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((...args) => ({
        ...createAuthSlice(...args),
        ...createGuestSlice(...args),
        ...createProfileSlice(...args),
        ...createNotificationSlice(...args),
        ...createPreferencesSlice(...args),
        ...createSettingsSlice(...args),
        ...createNavigationSlice(...args),
        ...createNetworkSlice(...args),
        ...createOfflineQueueSlice(...args),
      })),
      {
        name: (import.meta as any).env?.VITE_STORAGE_KEY || 'cap-platform-storage',
        storage: createJSONStorage(() => secureStorage as any),
        onRehydrateStorage: (_state) => {
          if (import.meta.env.DEV) console.log('[useAppStore] hydration started')
          return (state, error) => {
            if (error) {
              console.error('[useAppStore] hydration failed:', error)
              // Mark hydration complete even on failure so app doesn't hang
              setHydrated()
            } else {
              if (import.meta.env.DEV) {
                console.log('[useAppStore] hydration finished')
                console.log('[useAppStore] Hydrated Auth State:', state?.isAuthenticated)
              }
              // Use queueMicrotask to ensure state is fully applied before marking hydration complete
              // This prevents race conditions where components check auth state before it's updated
              queueMicrotask(() => {
                if (import.meta.env.DEV)
                  console.log('[useAppStore] setHydrated called (after microtask)')
                setHydrated()
              })
            }
          }
        },
        merge: (persistedState: any, currentState) => {
          if (!persistedState) {
            return currentState
          }

          // Deep merge for nested objects if needed, or simple shallow merge if structure matches
          // Since partialize created a nested structure (auth, preferences, etc),
          // checking if we need to flatten it back implies that the store is flat but we persisted it nested.
          // However, based on createAuthSlice, the store IS flat (user, isAuthenticated are top level).
          // But partialize returns { auth: { user, isAuthenticated } }.
          // So we MUST flatten it back.

          const settings = {
            ...(currentState.settings || {}),
            ...(persistedState.settings || {}),
          };

          return {
            ...currentState,
            ...persistedState,
            ...(persistedState.auth || {}),
            preferences: {
              ...(currentState.preferences || {}),
              ...(persistedState.preferences || {}),
            },
            settings,
            mode: settings.mode || persistedState.theme?.mode || currentState.mode,
            offlineQueue: persistedState.offlineQueue || currentState.offlineQueue,
          }
        },
        partialize: (state) => ({
          auth: {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            isAdmin: state.isAdmin,
          },
          preferences: state.preferences,
          settings: state.settings,
          offlineQueue: state.offlineQueue,
        }),
      },
    ),
    {
      name: (import.meta as any).env?.VITE_APP_NAME || 'cap-platform-store',
      enabled: import.meta.env.DEV,
      anonymousActionType: 'zustand/action',
      serialize: { options: true },
    },
  ),
) as unknown as {
  <T>(selector: (state: AppStore) => T): T
  getState(): AppStore
  setState(state: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>)): void
}

// --- Subscribe to Terminal Auth Errors ---
// When a terminal authentication failure occurs (e.g. 400 on refresh),
// we MUST clear the in-memory state to match the cleared storage
// to prevent infinite refresh loops in React components.
onTerminalError(() => {
  const state = useAppStore.getState()
  if (state.isAuthenticated) {
    console.warn('[AppStore] Received terminal auth error, forcing state reset')
    // Resetting state directly via store.setState to ensuring UI reactive updates
    useAppStore.setState(() => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      tokens: null,
    }))
  }
})

export const useAuthStore = () => {
  const user = useAppStore((state) => state.user)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const isAdmin = useAppStore((state) => state.isAdmin)
  const isLoading = useAppStore((state) => state.isLoading)
  const error = useAppStore((state) => state.error)
  const tokens = useAppStore((state) => state.tokens)
  const signIn = useAppStore((state) => state.signIn)
  const signOut = useAppStore((state) => state.signOut)
  const refreshAuth = useAppStore((state) => state.refreshAuth)
  const refreshToken = useAppStore((state) => state.refreshToken)
  const updateUser = useAppStore((state) => state.updateUser)
  const setUser = useAppStore((state) => state.setUser)
  const setTokens = useAppStore((state) => state.setTokens)
  const clearError = useAppStore((state) => state.clearError)

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    tokens,
    signIn,
    signOut,
    refreshAuth,
    refreshToken,
    updateUser,
    setUser,
    setTokens,
    clearError,
  }
}

export const useGuest = () => {
  const guestSession = useAppStore((state) => state.guestSession)
  const isGuest = useAppStore((state) => state.isGuest)
  const createGuestSession = useAppStore((state) => state.createGuestSession)
  const clearGuestSession = useAppStore((state) => state.clearGuestSession)
  const addGuestData = useAppStore((state) => state.addGuestData)
  const getGuestData = useAppStore((state) => state.getGuestData)
  const incrementAnalysisCount = useAppStore((state) => state.incrementAnalysisCount)
  const getAnalysisCount = useAppStore((state) => state.getAnalysisCount)

  return {
    guestSession,
    isGuest,
    createGuestSession,
    clearGuestSession,
    addGuestData,
    getGuestData,
    incrementAnalysisCount,
    analysisCounts: getAnalysisCount(),
  }
}


export const useProfile = () => {
  const profiles = useAppStore((state) => state.profiles)
  const activeProfile = useAppStore((state) => state.activeProfile)
  const addProfile = useAppStore((state) => state.addProfile)
  const updateProfile = useAppStore((state) => state.updateProfile)
  const deleteProfile = useAppStore((state) => state.deleteProfile)
  const setActiveProfile = useAppStore((state) => state.setActiveProfile)

  return {
    profiles,
    activeProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
  }
}

export const useNotifications = () => {
  const notifications = useAppStore((state) => state.notifications)
  const unreadCount = useAppStore((state) => state.unreadCount)
  const addNotification = useAppStore((state) => state.addNotification)
  const markAsRead = useAppStore((state) => state.markAsRead)
  const markAllAsRead = useAppStore((state) => state.markAllAsRead)
  const deleteNotification = useAppStore((state) => state.deleteNotification)
  const clearNotifications = useAppStore((state) => state.clearNotifications)

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  }
}

export const usePreferences = () => {
  const preferences = useAppStore((state) => state.preferences)
  const updatePreferences = useAppStore((state) => state.updatePreferences)
  const resetPreferences = useAppStore((state) => state.resetPreferences)

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  }
}

export const useSettings = () => {
  const settings = useAppStore((state) => state.settings)
  const isSettingsChanged = useAppStore((state) => state.isSettingsChanged)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const resetSettings = useAppStore((state) => state.resetSettings)
  const updatePageSettings = useAppStore((state) => state.updatePageSettings)

  return {
    settings,
    isSettingsChanged,
    updateSettings,
    resetSettings,
    updatePageSettings,
  }
}

/** @deprecated Use useVerticalNav from @cap/layout */
export const useVerticalNavStore = () => {
  const verticalNav = useAppStore((state) => state.verticalNav)
  const updateVerticalNavState = useAppStore((state) => state.updateVerticalNavState)
  const collapseVerticalNav = useAppStore((state) => state.collapseVerticalNav)
  const hoverVerticalNav = useAppStore((state) => state.hoverVerticalNav)
  const toggleVerticalNav = useAppStore((state) => state.toggleVerticalNav)

  return {
    ...verticalNav,
    updateVerticalNavState,
    collapseVerticalNav,
    hoverVerticalNav,
    toggleVerticalNav,
  }
}

/** @deprecated Use useHorizontalNav from @cap/layout */
export const useHorizontalNavStore = () => {
  const horizontalNav = useAppStore((state) => state.horizontalNav)
  const updateIsBreakpointReached = useAppStore((state) => state.updateIsBreakpointReached)

  return {
    ...horizontalNav,
    updateIsBreakpointReached,
  }
}

export const useTheme = () => {
  const mode = useAppStore((state) => state.settings.mode)
  const toggleColorMode = useAppStore((state) => state.toggleColorMode)
  const setMode = useAppStore((state) => state.setMode)

  return {
    mode,
    toggleColorMode,
    setMode,
  }
}

export const useNetwork = () => {
  const isOnline = useAppStore((state) => state.isOnline)
  const setOnline = useAppStore((state) => state.setOnline)
  const setOffline = useAppStore((state) => state.setOffline)

  return {
    isOnline,
    setOnline,
    setOffline,
  }
}

export const useOfflineQueue = () => {
  const offlineQueue = useAppStore((state) => state.offlineQueue)
  const addToOfflineQueue = useAppStore((state) => state.addToOfflineQueue)
  const removeFromOfflineQueue = useAppStore((state) => state.removeFromOfflineQueue)
  const incrementOfflineRetry = useAppStore((state) => state.incrementOfflineRetry)
  const clearOfflineQueue = useAppStore((state) => state.clearOfflineQueue)

  return {
    offlineQueue,
    addToOfflineQueue,
    removeFromOfflineQueue,
    incrementOfflineRetry,
    clearOfflineQueue,
  }
}
