import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createAuthSlice, AuthSlice } from '../store/authSlice'
import { createUiSlice, UiSlice } from '../store/uiSlice'
import type { StoreState } from '../store'

// ---------------------------------------------------------------------------
// Minimal test store that combines both slices (no persist/devtools overhead)
// ---------------------------------------------------------------------------
function createTestStore() {
  return create<StoreState>()(
    immer((...a) => ({
      ...createAuthSlice(...a),
      ...createUiSlice(...a),
    })),
  )
}

// ---------------------------------------------------------------------------
// AuthSlice
// ---------------------------------------------------------------------------
describe('authSlice', () => {
  let useStore: ReturnType<typeof createTestStore>

  beforeEach(() => {
    useStore = createTestStore()
  })

  it('has correct initial state', () => {
    const state = useStore.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.mfaRequired).toBe(false)
    expect(state.mfaMethod).toBeNull()
    expect(state.sessionId).toBeNull()
  })

  it('setUser updates the user', () => {
    const mockUser = { id: '1', email: 'test@example.com' } as any
    useStore.getState().setUser(mockUser)
    expect(useStore.getState().user).toEqual(mockUser)
  })

  it('setUser to null clears the user', () => {
    useStore.getState().setUser({ id: '1' } as any)
    useStore.getState().setUser(null)
    expect(useStore.getState().user).toBeNull()
  })

  it('setAuthenticated sets isAuthenticated to true', () => {
    useStore.getState().setAuthenticated(true)
    expect(useStore.getState().isAuthenticated).toBe(true)
  })

  it('setAuthenticated sets isAuthenticated to false', () => {
    useStore.getState().setAuthenticated(true)
    useStore.getState().setAuthenticated(false)
    expect(useStore.getState().isAuthenticated).toBe(false)
  })

  it('setLoading toggles isLoading', () => {
    useStore.getState().setLoading(true)
    expect(useStore.getState().isLoading).toBe(true)
    useStore.getState().setLoading(false)
    expect(useStore.getState().isLoading).toBe(false)
  })

  it('setSessionId stores the sessionId', () => {
    useStore.getState().setSessionId('sess_abc123')
    expect(useStore.getState().sessionId).toBe('sess_abc123')
  })

  it('setSessionId to null clears the sessionId', () => {
    useStore.getState().setSessionId('sess_abc123')
    useStore.getState().setSessionId(null)
    expect(useStore.getState().sessionId).toBeNull()
  })

  describe('setMfaRequired', () => {
    it('sets mfaRequired to true with a method', () => {
      useStore.getState().setMfaRequired(true, 'totp')
      expect(useStore.getState().mfaRequired).toBe(true)
      expect(useStore.getState().mfaMethod).toBe('totp')
    })

    it('sets mfaRequired to true with passkey method', () => {
      useStore.getState().setMfaRequired(true, 'passkey')
      expect(useStore.getState().mfaMethod).toBe('passkey')
    })

    it('defaults mfaMethod to null when method is omitted', () => {
      useStore.getState().setMfaRequired(true, 'totp')
      useStore.getState().setMfaRequired(false)
      expect(useStore.getState().mfaRequired).toBe(false)
      expect(useStore.getState().mfaMethod).toBeNull()
    })
  })

  describe('clearUser', () => {
    it('clears only the user, leaving other state intact', () => {
      useStore.getState().setUser({ id: '1' } as any)
      useStore.getState().setAuthenticated(true)
      useStore.getState().clearUser()
      expect(useStore.getState().user).toBeNull()
      // isAuthenticated should remain unchanged
      expect(useStore.getState().isAuthenticated).toBe(true)
    })
  })

  describe('clearAuth', () => {
    it('resets all auth fields to their initial values', () => {
      const state = useStore.getState()
      state.setUser({ id: '1' } as any)
      state.setAuthenticated(true)
      state.setMfaRequired(true, 'backup_code')
      state.setSessionId('sess_xyz')

      state.clearAuth()

      const after = useStore.getState()
      expect(after.user).toBeNull()
      expect(after.isAuthenticated).toBe(false)
      expect(after.mfaRequired).toBe(false)
      expect(after.mfaMethod).toBeNull()
      expect(after.sessionId).toBeNull()
    })
  })
})

// ---------------------------------------------------------------------------
// UiSlice
// ---------------------------------------------------------------------------
describe('uiSlice', () => {
  let useStore: ReturnType<typeof createTestStore>

  beforeEach(() => {
    useStore = createTestStore()
  })

  it('has correct initial state', () => {
    const state = useStore.getState()
    expect(state.authStep).toBe('credentials')
    expect(state.redirectAfterLogin).toBeNull()
    expect(state.errorBanner).toBeNull()
  })

  it('setAuthStep updates authStep', () => {
    useStore.getState().setAuthStep('mfa')
    expect(useStore.getState().authStep).toBe('mfa')
  })

  it('setAuthStep cycles through all valid steps', () => {
    const steps = ['credentials', 'mfa', 'passkey', 'complete'] as const
    for (const step of steps) {
      useStore.getState().setAuthStep(step)
      expect(useStore.getState().authStep).toBe(step)
    }
  })

  it('setRedirect stores a redirect path', () => {
    useStore.getState().setRedirect('/dashboard')
    expect(useStore.getState().redirectAfterLogin).toBe('/dashboard')
  })

  it('setRedirect to null clears the redirect', () => {
    useStore.getState().setRedirect('/dashboard')
    useStore.getState().setRedirect(null)
    expect(useStore.getState().redirectAfterLogin).toBeNull()
  })

  it('setErrorBanner stores an error message', () => {
    useStore.getState().setErrorBanner('Invalid credentials')
    expect(useStore.getState().errorBanner).toBe('Invalid credentials')
  })

  it('clearError removes the error banner', () => {
    useStore.getState().setErrorBanner('Some error')
    useStore.getState().clearError()
    expect(useStore.getState().errorBanner).toBeNull()
  })

  it('setErrorBanner to null explicitly clears the error', () => {
    useStore.getState().setErrorBanner('error')
    useStore.getState().setErrorBanner(null)
    expect(useStore.getState().errorBanner).toBeNull()
  })
})
