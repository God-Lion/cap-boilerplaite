/**
 * Platform API Package
 * 
 * HTTP client and API utilities for making authenticated requests.
 * This is the foundational layer for API communication.
 * 
 * No React dependencies - pure TypeScript only.
 */

import { ENDPOINTS } from '@cap/api-contracts'
import type { RefreshResponseDto, ApiResponse, PaginatedResponse, ApiErrorResponse } from '@cap/shared-types'

export { ENDPOINTS }
export type { ApiResponse, PaginatedResponse, ApiErrorResponse }

export interface FetchRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  data?: unknown
  timeout?: number
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'formData'
  _retry?: boolean
}

export interface FetchResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Headers
  config: FetchRequestConfig
  ok: boolean
}

export class HttpError extends Error {
  config: FetchRequestConfig
  request?: Request
  response?: FetchResponse<unknown>
  code?: string

  constructor(
    message: string,
    config: FetchRequestConfig,
    response?: FetchResponse<unknown>,
    code?: string,
  ) {
    super(message)
    this.name = 'HttpError'
    this.config = config
    this.response = response
    this.code = code
  }
}

export type TerminalErrorHandler = () => void
const terminalErrorHandlers: Set<TerminalErrorHandler> = new Set()

export const onTerminalError = (handler: TerminalErrorHandler) => {
  terminalErrorHandlers.add(handler)
  return () => terminalErrorHandlers.delete(handler)
}

const notifyTerminalError = () => {
  console.error('[FetchClient] Terminal authentication failure, notifying subscribers')
  terminalErrorHandlers.forEach((handler) => handler())
}

export type ForbiddenErrorHandler = () => void
const forbiddenErrorHandlers: Set<ForbiddenErrorHandler> = new Set()

export const onForbiddenError = (handler: ForbiddenErrorHandler) => {
  forbiddenErrorHandlers.add(handler)
  return () => forbiddenErrorHandlers.delete(handler)
}

const notifyForbiddenError = () => {
  console.error('[FetchClient] Access forbidden (403), notifying subscribers')
  forbiddenErrorHandlers.forEach((handler) => handler())
}

export interface TokenData {
  accessToken: string
  expiresAt: number
}

export abstract class SecureTokenManager {
  abstract getTokens(): TokenData | null
  abstract setTokens(tokens: TokenData): void
  abstract clearTokens(): void
  abstract isTokenExpired(): boolean
  abstract ensureInitialized(): Promise<void>
}

let _tokenManager: SecureTokenManager | null = null

export function setSecureTokenManager(manager: SecureTokenManager) {
  _tokenManager = manager
}

export function getSecureTokenManager(): SecureTokenManager | null {
  return _tokenManager
}

class TokenRefreshManager {
  private isRefreshing = false
  private isPaused = false
  private refreshPromise: Promise<string> | null = null
  private failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
  }> = []

  private processQueue(error: unknown = null, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else if (token) {
        promise.resolve(token)
      }
    })
    this.failedQueue = []
  }

  private async refreshTokenRequest(baseURL: string): Promise<string> {
    const tokenManager = getSecureTokenManager()
    if (!tokenManager) {
      throw new Error('Token manager not configured')
    }

    try {
      const response = await fetch(`${baseURL}${ENDPOINTS.auth.refresh}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`Refresh failed with status ${response.status}`)
      }

      const data: RefreshResponseDto = await response.json()

      const accessToken = data.access_token
      const expiresIn = data.expires_in || 3600

      if (!accessToken) {
        throw new Error('No access token in refresh response')
      }

      const expiresAt = Date.now() + expiresIn * 1000

      const newTokens: TokenData = {
        accessToken,
        expiresAt,
      }

      tokenManager.setTokens(newTokens)

      return accessToken
    } catch (error) {
      console.error('[Token Refresh] Failed:', (error as Error).message)
      throw error
    }
  }

  private handleRefreshFailure() {
    const tokenManager = getSecureTokenManager()
    if (tokenManager) {
      tokenManager.clearTokens()
    }

    try {
      localStorage.removeItem('cap-platform-storage')
      sessionStorage.clear()
    } catch (error) {
      console.log(`exception: ${error}`)
    }

    console.warn(
      '[TokenRefreshManager] Token refresh failed, tokens cleared. Application should redirect to login.',
    )

    notifyTerminalError()
  }

  async attemptRefresh(baseURL: string): Promise<string> {
    if (this.isPaused) {
      console.log('[TokenRefreshManager] Queue is paused, waiting for online status')
      return new Promise((resolve, reject) => {
        this.queueRequest(resolve, reject)
      })
    }

    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      this.isRefreshing = true

      try {
        const token = await this.refreshTokenRequest(baseURL)
        this.isPaused = false
        this.processQueue(null, token)
        return token
      } catch (error) {
        const isNetworkError =
          (error instanceof TypeError && (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))) ||
          (error as { status?: number }).status === 0 ||
          (error as { code?: string }).code === 'NETWORK_ERROR'

        if (isNetworkError) {
          console.warn('[TokenRefreshManager] Network failure detected during refresh. Pausing queue.')
          this.isPaused = true
          this.isRefreshing = false
          this.refreshPromise = null
          throw error
        }

        const isAuthFailure =
          (error as { status?: number }).status === 400 ||
          (error as { status?: number }).status === 401 ||
          (error as { status?: number }).status === 403

        if (isAuthFailure) {
          this.handleRefreshFailure()
          this.processQueue(error, null)
          throw error
        }

        this.processQueue(error, null)
        throw error
      } finally {
        if (!this.isPaused) {
          this.isRefreshing = false
          this.refreshPromise = null
        }
      }
    })()

    return this.refreshPromise
  }

  resume(baseURL: string) {
    if (!this.isPaused) return
    console.log('[TokenRefreshManager] Resuming queue...')
    this.isPaused = false
    this.attemptRefresh(baseURL)
  }

  isRefreshInProgress(): boolean {
    return this.isRefreshing || this.isPaused
  }

  queueRequest(resolve: (token: string) => void, reject: (error: unknown) => void) {
    this.failedQueue.push({ resolve, reject })
  }
}

export const refreshManager = new TokenRefreshManager()

export class FetchClient {
  public readonly baseURL: string
  private defaultHeaders: Record<string, string>
  private timeout: number
  private withCredentials: boolean

  constructor(config: {
    baseURL: string
    headers?: Record<string, string>
    timeout?: number
    withCredentials?: boolean
  }) {
    this.baseURL = config.baseURL
    this.defaultHeaders = config.headers || {}
    this.timeout = config.timeout || 51730
    this.withCredentials = config.withCredentials || false
  }

  public async request<T = unknown>(
    endpoint: string,
    config: FetchRequestConfig = {},
  ): Promise<FetchResponse<T>> {
    const tokenManager = getSecureTokenManager()
    
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

    if (config.params) {
      const params = new URLSearchParams()
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
      const queryString = params.toString()
      if (queryString) {
        url += `${url.includes('?') ? '&' : '?'}${queryString}`
      }
    }

    const headers = new Headers(config.headers)
    Object.entries(this.defaultHeaders).forEach(([key, value]) => {
      if (!headers.has(key)) {
        headers.set(key, value)
      }
    })

    if (!endpoint.includes(ENDPOINTS.auth.refresh)) {
      if (tokenManager) {
        await tokenManager.ensureInitialized()

        const tokens = tokenManager.getTokens()

        if (tokens) {
          if (tokenManager.isTokenExpired()) {
            try {
              let newToken: string
              if (refreshManager.isRefreshInProgress()) {
                newToken = await new Promise<string>((resolve, reject) => {
                  refreshManager.queueRequest(resolve, reject)
                })
              } else {
                newToken = await refreshManager.attemptRefresh(this.baseURL)
              }
              headers.set('Authorization', `Bearer ${newToken}`)
            } catch {
              console.error('[Fetch Client] Token refresh pre-check failed')
            }
          } else if (tokens.accessToken) {
            headers.set('Authorization', `Bearer ${tokens.accessToken}`)
          }
        }
      }
    }

    const timeout = config.timeout !== undefined ? config.timeout : this.timeout
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    let body = config.body
    if (config.data) {
      if (config.data instanceof FormData) {
        body = config.data
        headers.delete('Content-Type')
      } else {
        body = JSON.stringify(config.data)
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json')
        }
      }
    }

    const fetchConfig: RequestInit = {
      ...config,
      headers,
      body,
      signal: controller.signal,
      credentials: config.credentials || (this.withCredentials ? 'include' : undefined),
    }

    try {
      const response = await fetch(url, fetchConfig)
      clearTimeout(id)

      const responseData = await this.parseResponse(response, config.responseType)

      const result: FetchResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config,
        ok: response.ok,
      }

      if (!response.ok) {
        if (
          response.status === 401 &&
          !config._retry &&
          !endpoint.includes(ENDPOINTS.auth.refresh) &&
          !endpoint.includes(ENDPOINTS.auth.login)
        ) {
          config._retry = true
          try {
            let newToken: string
            if (refreshManager.isRefreshInProgress()) {
              newToken = await new Promise<string>((resolve, reject) => {
                refreshManager.queueRequest(resolve, reject)
              })
            } else {
              newToken = await refreshManager.attemptRefresh(this.baseURL)
            }

            const newHeaders = new Headers(config.headers)
            newHeaders.set('Authorization', `Bearer ${newToken}`)

            return this.request<T>(endpoint, {
              ...config,
              headers: Object.fromEntries(newHeaders.entries()),
            })
          } catch {
            throw new HttpError('Token refresh failed', config, result, 'REFRESH_FAILED')
          }
        }

        if (response.status === 403) {
          notifyForbiddenError()
        }

        throw new HttpError(
          (responseData as { message?: string })?.message || `Request failed with status ${response.status}`,
          config,
          result,
          String(response.status),
        )
      }

      return result
    } catch (error) {
      clearTimeout(id)
      if (error instanceof HttpError) throw error

      if ((error as { name?: string }).name === 'AbortError') {
        throw new HttpError('Request timeout', config, undefined, 'TIMEOUT')
      }

      const minimalResponse: FetchResponse<null> = {
        data: null,
        status: 0,
        statusText: 'Network Error',
        headers: new Headers(),
        config,
        ok: false,
      }
      throw new HttpError(
        (error as Error).message || 'Network Error',
        config,
        minimalResponse,
        'NETWORK_ERROR',
      )
    }
  }

  private async parseResponse(response: Response, responseType?: string) {
    if (response.status === 204) return null

    if (responseType === 'blob') return response.blob()
    if (responseType === 'text') return response.text()
    if (responseType === 'arraybuffer') return response.arrayBuffer()
    if (responseType === 'formData') return response.formData()

    try {
      return await response.json()
    } catch {
      return null
    }
  }

  get<T = unknown>(url: string, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  post<T = unknown>(url: string, data?: unknown, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'POST', data })
  }

  put<T = unknown>(url: string, data?: unknown, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'PUT', data })
  }

  patch<T = unknown>(url: string, data?: unknown, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'PATCH', data })
  }

  delete<T = unknown>(url: string, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }
}

export class ApiClient {
  constructor(private instance: FetchClient) {}

  async request<T = unknown>(endpoint: string, config: FetchRequestConfig = {}): Promise<FetchResponse<T>> {
    return this.instance.request<T>(endpoint, config)
  }

  async get<T = unknown>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>> {
    return this.instance.get<T>(url, config)
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: FetchRequestConfig,
  ): Promise<FetchResponse<T>> {
    return this.instance.post<T>(url, data, config)
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: FetchRequestConfig,
  ): Promise<FetchResponse<T>> {
    return this.instance.put<T>(url, data, config)
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: FetchRequestConfig,
  ): Promise<FetchResponse<T>> {
    return this.instance.patch<T>(url, data, config)
  }

  async delete<T = unknown>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>> {
    return this.instance.delete<T>(url, config)
  }

  async uploadFile<T = unknown>(
    url: string,
    files: File | Array<File>,
    fieldName = 'file',
    additionalData?: Record<string, unknown>,
  ): Promise<FetchResponse<T>> {
    const formData = new FormData()

    if (Array.isArray(files)) files.forEach((file) => formData.append(fieldName, file))
    else formData.append(fieldName, files)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, String(value))
      })
    }

    return this.instance.post<T>(url, formData)
  }

  async uploadFormData<T = unknown>(
    url: string,
    data: Record<string, unknown>,
    method: 'post' | 'put' | 'patch' = 'post',
  ): Promise<FetchResponse<T>> {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) formData.append(key, value)
        else if (Array.isArray(value)) value.forEach((item) => formData.append(key, item))
        else formData.append(key, String(value))
      }
    })

    return this.instance[method]<T>(url, formData)
  }

  get baseURL() {
    return this.instance.baseURL
  }

  async getWithFallback<T = unknown>(
    url: string,
    fallbackData: T,
    config?: FetchRequestConfig,
  ): Promise<FetchResponse<T>> {
    try {
      return await this.instance.get<T>(url, config)
    } catch (error) {
      console.warn(`Failed to fetch ${url}, using fallback data`, error)
      return {
        data: fallbackData,
        status: 200,
        statusText: 'OK (Fallback)',
        headers: new Headers(),
        config: config || {},
        ok: true,
      } as FetchResponse<T>
    }
  }
}

export function createApiClient(baseURL: string, headers?: Record<string, string>): ApiClient {
  const fetchClient = new FetchClient({
    baseURL,
    headers: headers || { 'Content-Type': 'application/json', Accept: 'application/json' },
  })
  return new ApiClient(fetchClient)
}
