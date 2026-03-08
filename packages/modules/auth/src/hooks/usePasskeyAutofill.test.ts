import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePasskeyAutofill } from '../hooks/usePasskeyAutofill'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockStartAuthentication = vi.fn()
const mockBrowserSupportsWebAuthnAutofill = vi.fn()

vi.mock('@simplewebauthn/browser', () => ({
  startAuthentication: mockStartAuthentication,
  browserSupportsWebAuthn: vi.fn(),
  browserSupportsWebAuthnAutofill: mockBrowserSupportsWebAuthnAutofill,
}))

const mockGetLoginOptions = vi.fn()
const mockVerifyLogin = vi.fn()
vi.mock('../services/auth.service', () => ({
  default: {
    passkeys: {
      getLoginOptions: mockGetLoginOptions,
      verifyLogin: mockVerifyLogin,
    },
  },
}))

const mockSetAuthenticated = vi.fn()
const mockSetUser = vi.fn()
const mockSetAuthStep = vi.fn()
const mockSetSessionId = vi.fn()
vi.mock('../store', () => ({
  useAuthStore: () => ({
    setAuthenticated: mockSetAuthenticated,
    setUser: mockSetUser,
    setAuthStep: mockSetAuthStep,
    setSessionId: mockSetSessionId,
  }),
}))

const mockSetTokens = vi.fn()
vi.mock('@cap/platform-core', () => ({
  secureTokenManager: { setTokens: mockSetTokens },
  Session: class {
    write = vi.fn()
  },
}))

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('usePasskeyAutofill', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with isAvailable=false and isLoading=false', () => {
    mockBrowserSupportsWebAuthnAutofill.mockResolvedValue(false)
    const { result } = renderHook(() => usePasskeyAutofill())
    expect(result.current.isAvailable).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets isAvailable=false and skips the flow when autofill is unsupported', async () => {
    mockBrowserSupportsWebAuthnAutofill.mockResolvedValue(false)

    const { result } = renderHook(() => usePasskeyAutofill())
    // Wait for the async support check to finish
    await waitFor(() => expect(mockBrowserSupportsWebAuthnAutofill).toHaveBeenCalled())

    expect(result.current.isAvailable).toBe(false)
    expect(mockGetLoginOptions).not.toHaveBeenCalled()
  })

  it('completes the full autofill flow when the browser supports conditional UI', async () => {
    mockBrowserSupportsWebAuthnAutofill.mockResolvedValue(true)
    mockGetLoginOptions.mockResolvedValue({ data: { challenge: 'abc' } })
    mockStartAuthentication.mockResolvedValue({ id: 'cred' })
    mockVerifyLogin.mockResolvedValue({
      data: { token: 'tok', expires_in: 3600, user: { id: '1' }, userId: 1 },
    })

    const onSuccess = vi.fn()
    const { result } = renderHook(() => usePasskeyAutofill(onSuccess))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isAvailable).toBe(true)
    expect(mockSetTokens).toHaveBeenCalledWith(expect.objectContaining({ accessToken: 'tok' }))
    expect(mockSetUser).toHaveBeenCalledWith({ id: '1' })
    expect(mockSetAuthenticated).toHaveBeenCalledWith(true)
    expect(mockSetAuthStep).toHaveBeenCalledWith('complete')
    expect(mockSetSessionId).toHaveBeenCalledWith('1')
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('does not call onSuccess when verify response has no token', async () => {
    mockBrowserSupportsWebAuthnAutofill.mockResolvedValue(true)
    mockGetLoginOptions.mockResolvedValue({ data: { challenge: 'abc' } })
    mockStartAuthentication.mockResolvedValue({ id: 'cred' })
    mockVerifyLogin.mockResolvedValue({ data: {} }) // no token

    const onSuccess = vi.fn()
    const { result } = renderHook(() => usePasskeyAutofill(onSuccess))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockSetAuthenticated).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('sets error state when a non-abort error is thrown', async () => {
    mockBrowserSupportsWebAuthnAutofill.mockResolvedValue(true)
    mockGetLoginOptions.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => usePasskeyAutofill())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe('Network error')
  })

  it('suppresses AbortError silently (expected cancellation)', async () => {
    mockBrowserSupportsWebAuthnAutofill.mockResolvedValue(true)
    mockGetLoginOptions.mockResolvedValue({ data: { challenge: 'abc' } })
    const abortErr = new Error('The user aborted a request')
    abortErr.name = 'AbortError'
    mockStartAuthentication.mockRejectedValue(abortErr)

    const { result } = renderHook(() => usePasskeyAutofill())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBeNull()
  })

  it('suppresses error with "The user aborted a request" message', async () => {
    mockBrowserSupportsWebAuthnAutofill.mockResolvedValue(true)
    mockGetLoginOptions.mockResolvedValue({ data: { challenge: 'abc' } })
    const abortErr = new Error('The user aborted a request')
    mockStartAuthentication.mockRejectedValue(abortErr)

    const { result } = renderHook(() => usePasskeyAutofill())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBeNull()
  })

  it('does not run initAutofill a second time on rerender (initializedRef guard)', async () => {
    mockBrowserSupportsWebAuthnAutofill.mockResolvedValue(false)

    const { rerender } = renderHook(() => usePasskeyAutofill())
    await waitFor(() => expect(mockBrowserSupportsWebAuthnAutofill).toHaveBeenCalledTimes(1))

    rerender()
    // Should NOT have been called a second time
    expect(mockBrowserSupportsWebAuthnAutofill).toHaveBeenCalledTimes(1)
  })
})
