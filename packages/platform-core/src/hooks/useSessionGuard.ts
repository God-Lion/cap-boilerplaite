import React from 'react'
import { useAuth } from './useAuth'
import { useHasHydrated } from '@cap/platform-store'

export const useSessionGuard = () => {
  const hasHydrated = useHasHydrated()
  const { user, isAuthenticated, refreshAuth } = useAuth()
  const [isLoading, setIsLoading] = React.useState(true)
  const [sessionError, setSessionError] = React.useState<string | null>(null)

  const isMountedRef = React.useRef(false)
  const hasCheckedRef = React.useRef(false)

  React.useEffect(() => {
    isMountedRef.current = true

    const checkSession = async () => {
      if (!hasHydrated) {
        console.log('[SessionGuard] Waiting for hydration...')
        return
      }

      if (hasCheckedRef.current) {
        return
      }
      hasCheckedRef.current = true

      console.log(
        '[SessionGuard] Hydration complete. isAuthenticated:',
        isAuthenticated,
        'user:',
        !!user,
      )

      try {
        if (isAuthenticated && user) {
          console.log('[SessionGuard] User already authenticated from persisted state')
          if (isMountedRef.current) setIsLoading(false)
          return
        }

        console.log('[SessionGuard] Not authenticated, calling refreshAuth...')
        if (typeof refreshAuth === 'function') {
          await refreshAuth()
        }
      } catch (error) {
        console.error('[SessionGuard] Check failed:', error)
        if (isMountedRef.current) setSessionError('Your session has expired. Please log in again.')
      } finally {
        if (isMountedRef.current) setIsLoading(false)
      }
    }

    checkSession()

    return () => {
      isMountedRef.current = false
    }
  }, [hasHydrated, isAuthenticated, user, refreshAuth])

  if (!hasHydrated) {
    return {
      isLoading: true,
      sessionError: null,
      isAuthenticated: false,
      user: null,
    }
  }

  return {
    isLoading,
    sessionError,
    isAuthenticated,
    user,
  }
}
