import { API_CONFIG } from './api.config'
import { secureTokenManager, TokenData } from '../secureTokenManager'

interface RefreshResponse {
  access_token: string
  refresh_token: string
  token?: string
  expires_in: number
}

export interface FetchRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  data?: any // Body data
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'formData'
  _retry?: boolean // For internal use
}

export interface FetchResponse<T = any> {
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
  response?: FetchResponse
  code?: string

  constructor(
    message: string,
    config: FetchRequestConfig,
    response?: FetchResponse,
    code?: string,
  ) {
    super(message)
    this.name = 'HttpError'
    this.config = config
    this.response = response
    this.code = code
  }
}

class TokenRefreshManager {
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null
  private failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: any) => void
  }> = []

  private processQueue(error: any = null, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else if (token) {
        promise.resolve(token)
      }
    })
    this.failedQueue = []
  }

  private async refreshTokenRequest(): Promise<string> {
    const tokens = secureTokenManager.getTokens()

    if (!tokens || !tokens.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.refreshToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Refresh failed with status ${response.status}`)
      }

      const data: RefreshResponse = await response.json()

      // Handle different response formats from backend
      const accessToken = data.access_token || data.token
      const refreshToken = data.refresh_token || tokens.refreshToken
      const expiresIn = data.expires_in || 3600

      if (!accessToken) {
        throw new Error('No access token in refresh response')
      }

      const expiresAt = Date.now() + expiresIn * 1000

      const newTokens: TokenData = {
        accessToken,
        refreshToken,
        expiresAt,
      }

      secureTokenManager.setTokens(newTokens)

      if (import.meta.env.DEV) {
        console.log('[Token Refresh] Success')
      }

      return accessToken
    } catch (error: any) {
      console.error('[Token Refresh] Failed:', error.message)
      throw error
    }
  }

  private handleRefreshFailure() {
    secureTokenManager.clearTokens()

    // Clear any stored state
    try {
      localStorage.removeItem('god-lion-seeker-optimizer-storage')
      sessionStorage.clear()
    } catch (e) {
      // Ignore storage errors
    }

    // Only redirect if not already on login page
    if (window.location.pathname !== '/auth/signin' && window.location.pathname !== '/auth/login') {
      window.location.href = '/auth/signin'
    }
  }

  async attemptRefresh(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // Create new refresh promise
    this.refreshPromise = (async () => {
      this.isRefreshing = true

      try {
        const token = await this.refreshTokenRequest()
        this.processQueue(null, token)
        return token
      } catch (error) {
        this.processQueue(error, null)
        this.handleRefreshFailure()
        throw error
      } finally {
        this.isRefreshing = false
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  isRefreshInProgress(): boolean {
    return this.isRefreshing
  }

  queueRequest(resolve: (token: string) => void, reject: (error: any) => void) {
    this.failedQueue.push({ resolve, reject })
  }
}

export const refreshManager = new TokenRefreshManager()

export class FetchClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(config: { baseURL: string; headers?: Record<string, string> }) {
    this.baseURL = config.baseURL
    this.defaultHeaders = config.headers || {}
  }

  public async request<T = any>(
    endpoint: string,
    config: FetchRequestConfig = {},
  ): Promise<FetchResponse<T>> {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

    // Append params to URL
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

    // Prepare headers
    const headers = new Headers(config.headers)
    Object.entries(this.defaultHeaders).forEach(([key, value]) => {
      if (!headers.has(key)) {
        headers.set(key, value)
      }
    })

    // Request Interceptor Logic
    if (!endpoint.includes('/auth/refresh')) {
      const tokens = secureTokenManager.getTokens()
      if (tokens) {
        if (secureTokenManager.isTokenExpired()) {
          try {
            let newToken: string
            if (refreshManager.isRefreshInProgress()) {
              newToken = await new Promise<string>((resolve, reject) => {
                refreshManager.queueRequest(resolve, reject)
              })
            } else {
              newToken = await refreshManager.attemptRefresh()
            }
            headers.set('Authorization', `Bearer ${newToken}`)
          } catch (e) {
            console.error('[Fetch Client] Token refresh pre-check failed', e)
            // Proceed without valid token, might fail 401
          }
        } else if (tokens.accessToken) {
          headers.set('Authorization', `Bearer ${tokens.accessToken}`)
        }
      }
    }

    // Prepare body
    let body = config.body
    if (config.data) {
      if (config.data instanceof FormData) {
        body = config.data
        // Don't set Content-Type for FormData, let browser set it with boundary
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
    }

    if (import.meta.env.DEV) {
      console.log(`[Fetch Request] ${config.method || 'GET'} ${url}`, {
        params: config.params,
        data: config.data,
      })
    }

    try {
      const response = await fetch(url, fetchConfig)

      const responseData = await this.parseResponse(response, config.responseType)

      const result: FetchResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config,
        ok: response.ok,
      }

      if (import.meta.env.DEV) {
        console.log(`[Fetch Response] ${config.method || 'GET'} ${url}`, {
          status: response.status,
          data: responseData,
        })
      }

      if (!response.ok) {
        // Handle 401 & Retry
        if (response.status === 401 && !config._retry && !endpoint.includes('/auth/refresh')) {
          config._retry = true
          try {
            let newToken: string
            if (refreshManager.isRefreshInProgress()) {
              newToken = await new Promise<string>((resolve, reject) => {
                refreshManager.queueRequest(resolve, reject)
              })
            } else {
              newToken = await refreshManager.attemptRefresh()
            }

            // Update headers with new token
            const newHeaders = new Headers(config.headers)
            newHeaders.set('Authorization', `Bearer ${newToken}`)

            return this.request<T>(endpoint, {
              ...config,
              headers: Object.fromEntries(newHeaders.entries()),
            })
          } catch (refreshError) {
            throw new HttpError('Token refresh failed', config, result, 'REFRESH_FAILED')
          }
        }

        throw new HttpError(
          responseData?.message || `Request failed with status ${response.status}`,
          config,
          result,
          String(response.status),
        )
      }

      return result
    } catch (error: any) {
      if (error instanceof HttpError) throw error

      // Network error or other fetch error
      const minimalResponse: FetchResponse<any> = {
        data: null,
        status: 0,
        statusText: 'Network Error',
        headers: new Headers(),
        config,
        ok: false,
      }
      throw new HttpError(
        error.message || 'Network Error',
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

    // Default to JSON
    try {
      return await response.json()
    } catch (e) {
      return null // No JSON body
    }
  }

  // Convenience methods
  get<T = any>(url: string, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  post<T = any>(url: string, data?: any, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'POST', data })
  }

  put<T = any>(url: string, data?: any, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'PUT', data })
  }

  patch<T = any>(url: string, data?: any, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'PATCH', data })
  }

  delete<T = any>(url: string, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }
}

// Export singleton
export const fetchClient = new FetchClient({
  baseURL: API_CONFIG.baseURL,
  headers: API_CONFIG.headers,
})

export default fetchClient
