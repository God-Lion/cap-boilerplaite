import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useObjectCookie } from '../useObjectCookie'

// ─── Mock react-use's useCookie ───────────────────────────────────────────────
// useCookie returns [stringValue, updateFn, deleteFn].
// We simulate a tiny in-memory cookie store per test.

let cookieStore: string | null = null
const updateCookieMock = vi.fn((val: string) => { cookieStore = val })

vi.mock('react-use', () => ({
  useCookie: (_key: string) => [cookieStore, updateCookieMock],
}))

beforeEach(() => {
  cookieStore = null
  updateCookieMock.mockClear()
  updateCookieMock.mockImplementation((val: string) => { cookieStore = val })
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useObjectCookie', () => {
  it('returns the fallback value when the cookie is empty', () => {
    cookieStore = null
    const fallback = { theme: 'dark' }
    const { result } = renderHook(() => useObjectCookie('prefs', fallback))
    expect(result.current[0]).toEqual(fallback)
  })

  it('returns null when no fallback is provided and cookie is empty', () => {
    cookieStore = null
    const { result } = renderHook(() => useObjectCookie('prefs'))
    expect(result.current[0]).toBeNull()
  })

  it('parses the JSON cookie string into an object', () => {
    cookieStore = JSON.stringify({ lang: 'fr' })
    const { result } = renderHook(() => useObjectCookie<{ lang: string }>('prefs'))
    expect(result.current[0]).toEqual({ lang: 'fr' })
  })

  it('serialises the new value to JSON when updateValue is called', () => {
    cookieStore = null
    const { result } = renderHook(() => useObjectCookie<{ count: number }>('counter', { count: 0 }))

    act(() => {
      result.current[1]({ count: 5 })
    })

    expect(updateCookieMock).toHaveBeenCalledOnce()
    expect(updateCookieMock).toHaveBeenCalledWith(JSON.stringify({ count: 5 }))
  })

  it('works with array values', () => {
    cookieStore = JSON.stringify([1, 2, 3])
    const { result } = renderHook(() => useObjectCookie<number[]>('ids'))
    expect(result.current[0]).toEqual([1, 2, 3])
  })

  it('passes through nested objects correctly', () => {
    const nested = { user: { id: 42, roles: ['admin'] } }
    cookieStore = JSON.stringify(nested)
    const { result } = renderHook(() => useObjectCookie<typeof nested>('session'))
    expect(result.current[0]).toEqual(nested)
  })
})
