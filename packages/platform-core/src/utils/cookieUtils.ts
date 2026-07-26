/**
 * Cookie utility functions for client-side cookie access
 * These are plain functions (not hooks) that can be used anywhere
 */

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return decodeURIComponent(cookieValue || '')
    }
  }
  return null
}

/**
 * Set a cookie with optional expiration
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 365,
  path: string = '/',
): void {
  if (typeof document === 'undefined') return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path};SameSite=Lax;Secure`
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}`
}

/**
 * Get a cookie value parsed as JSON
 */
export function getJsonCookie<T>(name: string, fallback?: T): T {
  const value = getCookie(name)
  if (!value) return fallback as T

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback as T
  }
}

/**
 * Set a cookie value as JSON
 */
export function setJsonCookie<T>(
  name: string,
  value: T,
  days: number = 365,
  path: string = '/',
): void {
  setCookie(name, JSON.stringify(value), days, path)
}
