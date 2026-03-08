import { secureTokenManager, TokenData } from '../secureTokenManager'

// --- API Configuration ---

const getBaseURL = (): string => {
  const envApiUrl = import.meta.env.VITE_API_URL
  const isDev = import.meta.env.DEV
  const isProd = import.meta.env.PROD

  if (!envApiUrl) {
    if (isDev) {
      console.warn('VITE_API_URL not set, using default: http://localhost:3333')
      return 'http://localhost:3333'
    }
    console.error('VITE_API_URL not configured for production')
    throw new Error('VITE_API_URL must be configured in production')
  }

  if (isProd && !envApiUrl.startsWith('https://')) {
    console.error('❌ CRITICAL: Production API must use HTTPS!')
    throw new Error('Production API must use HTTPS protocol')
  }

  return envApiUrl
}

export const API_CONFIG = {
  baseURL: getBaseURL(),
  timeout: import.meta.env.VITE_API_TIMEOUT ? Number(import.meta.env.VITE_API_TIMEOUT) : 51730,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const

export const ENDPOINTS = {
  // Health & Metrics
  health: {
    root: '/',
    basic: '/api/health',
    live: '/api/health/live',
    ready: '/api/health/ready',
    detailed: '/api/health/detailed',
    startup: '/api/health/startup',
  },
  metrics: {
    basic: '/api/metrics',
    prometheus: '/api/metrics/prometheus',
  },

  // Auth
  auth: {
    register: '/api/auth/register',
    signup: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    refresh: '/api/auth/refresh',
    session: '/api/auth/session',
    trackFailedLogin: '/api/auth/track-failed-login',
    verifyEmail: (email: string, signature: string) =>
      `/api/auth/verification/email/${email}?signature=${signature}`,
    verifyResetPassword: (email: string, signature: string) =>
      `/api/auth/reset-password/${email}?signature=${signature}`,
    resendVerification: '/api/auth/verification/email/resend',
    verifyEmailToken: (email: string, signature: string) =>
      `/api/auth/verification/email/${email}?signature=${signature}`,
    validateUser: (id: string | number, token: string) => `/api/auth/validate/${id}/${token}`,
    passkey: {
      registerStart: '/api/auth/passkey/register/start',
      registerFinish: '/api/auth/passkey/register/finish',
      loginStart: '/api/auth/passkey/login/start',
      loginFinish: '/api/auth/passkey/login/finish',
    },
    mfa: {
      setup: '/api/auth/mfa/setup',
      verify: '/api/auth/mfa/verify',
      disable: '/api/auth/mfa/disable',
      recoveryCodes: '/api/auth/mfa/recovery-codes',
      recoveryVerify: '/api/auth/mfa/recovery-verify',
      verifyLogin: '/api/auth/mfa/verify-login',
      regenerateBackupCodes: '/api/auth/mfa/regenerate-backup-codes',
    },
    sessions: '/api/auth/sessions',
    revokeSession: (sessionId: string) => `/api/auth/sessions/${sessionId}`,
    revokeAllSessions: '/api/auth/sessions/revoke-all',
    loginHistory: '/api/auth/login-history',
    securityLogs: '/api/auth/security-logs',
  },

  // User
  user: {
    me: '/api/user/me',
    update: '/api/user/update',
    changeEmail: '/api/user/change-email',
    changePassword: '/api/user/change-password',
    destroy: '/api/user',
    deactivate: '/api/user/deactivate',
    linkedAccounts: '/api/user/linked-accounts',
    linkAccount: '/api/user/link-account',
    unlinkAccount: (id: string | number) => `/api/user/linked-accounts/${id}`,
    emailPreferences: '/api/user/email-preferences',
    tokens: {
      index: '/api/user/tokens',
      store: '/api/user/tokens',
      destroy: (id: string | number) => `/api/user/tokens/${id}`,
    },
    passkeys: {
      index: '/api/user/passkeys',
      update: (id: string | number) => `/api/user/passkeys/${id}`,
      destroy: (id: string | number) => `/api/user/passkeys/${id}`,
    },
    mfa: {
      methods: '/api/user/mfa-methods',
    },
  },

  // Resume Profiles
  profiles: {
    list: '/api/profiles',
    upload: '/api/profiles/upload',
    byId: (id: number) => `/api/profiles/${id}`,
    setActive: (id: number) => `/api/profiles/${id}/set-active`,
    update: (id: number) => `/api/profiles/${id}`,
    delete: (id: number) => `/api/profiles/${id}`,
    activeStatus: (id: number) => `/api/profiles/${id}/active-status`,
  },

  // Logs & Events
  logs: '/logs',
  event: '/event',

  // Translation
  translation: (code: string) => `/translate/${code}.json`,

  // Guest/Anonymous Routes
  guest: {
    analyzeAnonymous: '/api/guest/analyze-anonymous',
    matchAnonymous: '/api/guest/match-anonymous',
    getSession: (sessionId: string) => `/api/guest/session/${sessionId}`,
    deleteSession: (sessionId: string) => `/api/guest/session/${sessionId}`,
  },

  // Statistics
  statistics: {
    overview: '/api/statistics/overview',
    jobsByLocation: '/api/statistics/jobs-by-location',
    jobsByCompany: '/api/statistics/jobs-by-company',
    jobsByType: '/api/statistics/jobs-by-type',
    jobsByExperience: '/api/statistics/jobs-by-experience',
    scrapingActivity: '/api/statistics/scraping-activity',
    topSkills: '/api/statistics/top-skills',
    recentJobs: '/api/statistics/recent-jobs',
    sessionStatistics: '/api/statistics/session-statistics',
    trends: '/api/statistics/trends',
  },

  // Dashboard
  dashboard: {
    overview: '/api/dashboard/overview',
    stats: '/api/dashboard/stats',
    recentApplications: '/api/dashboard/recent-applications',
    recommendations: '/api/dashboard/recommendations',
  },

  // Automation
  automation: {
    config: '/api/automation/config',
    updateConfig: '/api/automation/config',
    start: '/api/automation/start',
    stop: '/api/automation/stop',
    status: '/api/automation/status',
    history: '/api/automation/history',
    stats: '/api/automation/stats',
    runNow: '/api/automation/run-now',
  },

  // Notifications
  notifications: {
    list: '/api/notifications',
    markAsRead: (id: number) => `/api/notifications/${id}/read`,
    markAllAsRead: '/api/notifications/read-all',
    delete: (id: number) => `/api/notifications/${id}`,
    clearAll: '/api/notifications/clear-all',
    preferences: '/api/notifications/preferences',
    updatePreferences: '/api/notifications/preferences',
    unreadCount: '/api/notifications/unread-count',
    ws: '/ws/notifications',
  },

  // Server-Sent Events
  sse: {
    scrapingProgress: (sessionId: number | string) => `/api/sse/scraping/${sessionId}`,
    analysisProgress: (analysisId: number) => `/api/sse/analysis/${analysisId}`,
  },

  // Admin Panel
  admin: {
    dashboard: '/api/admin/dashboard',
    users: {
      list: '/api/admin/users',
      byId: (id: number) => `/api/admin/users/${id}`,
      update: (id: number) => `/api/admin/users/${id}`,
      bulkAction: '/api/admin/users/bulk',
    },
    securityLogs: '/api/admin/security-logs',
  },

  // RBAC & Permissions
  rbac: {
    permissions: {
      list: '/api/admin/rbac/permissions',
      byId: (id: number) => `/api/admin/rbac/permissions/${id}`,
      grant: '/api/admin/rbac/permissions/grant',
      revoke: '/api/admin/rbac/permissions/revoke',
    },
    roles: {
      permissions: (role: string) => `/api/admin/rbac/roles/${role}/permissions`,
      assignPermission: '/api/admin/rbac/roles/assign-permission',
    },
    users: {
      assignRole: '/api/admin/rbac/users/assign-role',
    },
  },

  // Security
  security: {
    cspReport: '/api/security/csp-report',
    cspReportAlt: '/api/security/report/csp',
    headersTest: '/api/security/security-headers-test',
  },

  // Audit Logging
  audit: {
    logs: '/api/audit/logs',
    export: '/api/audit/logs/export',
    statistics: '/api/audit/statistics',
    compliance: '/api/audit/compliance',
  },

  // Backup & Disaster Recovery
  backup: {
    create: '/api/backup/create',
    list: '/api/backup/list',
    byId: (id: number | string) => `/api/backup/${id}`,
    verify: (id: number | string) => `/api/backup/${id}/verify`,
    restore: '/api/backup/restore',
    pitr: '/api/backup/pitr',
    testRestore: (id: number | string) => `/api/backup/${id}/test`,
    rpoStatus: '/api/backup/rpo-status',
  },

  // GDPR Compliance
  gdpr: {
    dataExport: '/api/gdpr/data-export',
    downloadExport: (exportId: number | string) => `/api/gdpr/export/${exportId}/download`,
    dataDeletion: '/api/gdpr/data-deletion',
    verifyDeletion: (requestId: number | string) => `/api/gdpr/deletion/${requestId}/verify`,
    consent: '/api/gdpr/consent',
    updateConsent: (consentId: number) => `/api/gdpr/consent/${consentId}`,
    consentStatus: '/api/gdpr/consent/status',
    retentionReport: '/api/gdpr/retention-report',
    processingActivities: '/api/gdpr/processing-activities',
  },
} as const

export const QUERY_KEYS = {
  // Health & Metrics
  health: {
    all: ['health'] as const,
    basic: ['health', 'basic'] as const,
    detailed: ['health', 'detailed'] as const,
  },
  metrics: {
    all: ['metrics'] as const,
    basic: ['metrics', 'basic'] as const,
    prometheus: ['metrics', 'prometheus'] as const,
  },

  // Auth
  auth: {
    all: ['auth'] as const,
    session: ['auth', 'session'] as const,
    profileSettings: ['auth', 'profile-settings'] as const,
    validateUser: (id: string | number, token: string) => ['auth', 'validate', id, token] as const,
    mfa: {
      status: ['auth', 'mfa', 'status'] as const,
    },
    sessions: ['auth', 'sessions'] as const,
    loginHistory: (limit: number) => ['auth', 'login-history', limit] as const,
    securityLogs: (params: unknown) => ['auth', 'security-logs', params] as const,
    linkedAccounts: ['auth', 'linked-accounts'] as const,
    emailPreferences: ['auth', 'email-preferences'] as const,
  },

  translation: (code: string) => ['translation', code] as const,
  settings: ['settings'] as const,
  validateUser: (id: string | number, token: string) => ['validateUser', id, token] as const,

  users: {
    all: ['users'] as const,
    byId: (id: number) => ['users', id] as const,
    byUserType: (userTypeId: number) => ['users', userTypeId] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    overview: ['dashboard', 'overview'] as const,
    stats: ['dashboard', 'stats'] as const,
    recentApplications: ['dashboard', 'recent-applications'] as const,
    recommendations: ['dashboard', 'recommendations'] as const,
  },

  // Automation
  automation: {
    all: ['automation'] as const,
    config: ['automation', 'config'] as const,
    status: ['automation', 'status'] as const,
    history: (params?: string) =>
      params ? (['automation', 'history', params] as const) : (['automation', 'history'] as const),
    stats: ['automation', 'stats'] as const,
    logs: (params: string) => ['automation', 'logs', params] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (params: string) => ['notifications', 'list', params] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
    preferences: ['notifications', 'preferences'] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    dashboard: ['admin', 'dashboard'] as const,
    users: {
      all: ['admin', 'users'] as const,
      byId: (id: number) => ['admin', 'users', id] as const,
      list: (params: string) => ['admin', 'users', 'list', params] as const,
    },
    securityLogs: (params: string) => ['admin', 'security-logs', params] as const,
  },

  // RBAC
  rbac: {
    all: ['rbac'] as const,
    permissions: {
      all: ['rbac', 'permissions'] as const,
      byId: (id: number) => ['rbac', 'permissions', id] as const,
    },
    roles: {
      permissions: (role: string) => ['rbac', 'roles', role, 'permissions'] as const,
    },
  },

  // Audit
  audit: {
    all: ['audit'] as const,
    logs: (params: string) => ['audit', 'logs', params] as const,
    statistics: ['audit', 'statistics'] as const,
    compliance: ['audit', 'compliance'] as const,
  },

  // Backup
  backup: {
    all: ['backup'] as const,
    list: ['backup', 'list'] as const,
    byId: (id: number | string) => ['backup', id] as const,
    rpoStatus: ['backup', 'rpo-status'] as const,
  },

  // GDPR
  gdpr: {
    all: ['gdpr'] as const,
    exports: ['gdpr', 'exports'] as const,
    exportById: (id: number | string) => ['gdpr', 'export', id] as const,
    consentStatus: ['gdpr', 'consent', 'status'] as const,
    retentionReport: ['gdpr', 'retention-report'] as const,
    processingActivities: ['gdpr', 'processing-activities'] as const,
  },
} as const

// --- Types ---

import {
  RefreshResponseDto,
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
} from '@cap/shared-types'

export interface FetchRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  data?: any // Body data
  timeout?: number // Request timeout in ms
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'formData'
  _retry?: boolean // For internal use
}

export type { ApiResponse, PaginatedResponse, ApiErrorResponse }

export interface FetchResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Headers
  config: FetchRequestConfig
  ok: boolean
}

// --- HttpError ---

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

// --- Terminal Error Registry ---

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

// --- Token Refresh Manager ---

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
    // Note: We don't need to check for refresh token presence here as it's in an HttpOnly cookie
    // The backend will check the cookie.

    try {
      // Send request WITHOUT Authorization header - cookies are sent automatically
      // CRITICAL: Must use credentials: 'include' to send refresh HttpOnly cookie cross-origin
      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.refresh}`, {
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

      // Handle response - we expect access_token
      const accessToken = data.access_token
      // We don't get refresh_token back in body (it's in cookie)
      const expiresIn = data.expires_in || 3600

      if (!accessToken) {
        throw new Error('No access token in refresh response')
      }

      const expiresAt = Date.now() + expiresIn * 1000

      const newTokens: TokenData = {
        accessToken,
        expiresAt,
      }

      secureTokenManager.setTokens(newTokens)

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
    } catch (error) {
      console.log(`exception: ${error}`)
    }

    // Log the failure - let React Router handle navigation
    console.warn(
      '[TokenRefreshManager] Token refresh failed, tokens cleared. Application should redirect to login.',
    )

    // Notify listeners so store can be updated
    notifyTerminalError()
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

// --- FetchClient ---

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

  public async request<T = any>(
    endpoint: string,
    config: FetchRequestConfig = {},
  ): Promise<FetchResponse<T>> {
    console.log('FetchClient request')
    console.log('endpoint', endpoint)
    console.log('config', config)
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
    if (!endpoint.includes(ENDPOINTS.auth.refresh)) {
      // Ensure tokens are loaded from storage before accessing
      await secureTokenManager.ensureInitialized()

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
          } catch {
            console.error('[Fetch Client] Token refresh pre-check failed')
            // Proceed without valid token, might fail 401
          }
        } else if (tokens.accessToken) {
          headers.set('Authorization', `Bearer ${tokens.accessToken}`)
        }
      }
    }

    // Prepare timeout
    const timeout = config.timeout !== undefined ? config.timeout : this.timeout
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

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
      signal: controller.signal,
      credentials: config.credentials || (this.withCredentials ? 'include' : undefined),
    }

    try {
      console.log('FetchClient fetch')
      console.log('url', url)
      console.log('fetchConfig', fetchConfig)
      const response = await fetch(url, fetchConfig)
      clearTimeout(id)
      console.log('response', response)

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
        // Handle 401 & Retry
        if (
          response.status === 401 &&
          !config._retry &&
          !endpoint.includes(ENDPOINTS.auth.refresh)
        ) {
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
          } catch {
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
      clearTimeout(id)
      if (error instanceof HttpError) throw error

      if (error.name === 'AbortError') {
        throw new HttpError('Request timeout', config, undefined, 'TIMEOUT')
      }

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
    } catch {
      return null // No JSON body
    }
  }

  // Convenience methods
  get<T = any>(url: string, config?: FetchRequestConfig) {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  post<T = any>(url: string, data?: any, config?: FetchRequestConfig) {
    console.log('FetchClient post')
    console.log('url', url)
    console.log('data', data)
    console.log('config', config)
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

// Export singleton fetchClient
export const fetchClient = new FetchClient({
  baseURL: API_CONFIG.baseURL,
  headers: { ...API_CONFIG.headers },
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
})

// --- ApiClient (Wrapper) ---

export class ApiClient {
  constructor(private instance: FetchClient = fetchClient) {}

  async get<T = any>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>> {
    return this.instance.get<T>(url, config)
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: FetchRequestConfig,
  ): Promise<FetchResponse<T>> {
    console.log('ApiClient post')
    console.log('url', url)
    console.log('data', data)
    console.log('config', config)
    return this.instance.post<T>(url, data, config)
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: FetchRequestConfig,
  ): Promise<FetchResponse<T>> {
    return this.instance.put<T>(url, data, config)
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: FetchRequestConfig,
  ): Promise<FetchResponse<T>> {
    return this.instance.patch<T>(url, data, config)
  }

  async delete<T = any>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>> {
    return this.instance.delete<T>(url, config)
  }

  async uploadFile<T = any>(
    url: string,
    files: File | Array<File>,
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
  ): Promise<FetchResponse<T>> {
    const formData = new FormData()

    if (Array.isArray(files)) files.forEach((file) => formData.append(fieldName, file))
    else formData.append(fieldName, files)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value)
      })
    }

    return this.instance.post<T>(url, formData)
  }

  async uploadFormData<T = any>(
    url: string,
    data: Record<string, any>,
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

  async getWithFallback<T = any>(
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
        success: true, // Added for compatibility if needed
      } as unknown as FetchResponse<T>
    }
  }
}

// --- Utilities ---

export function handleApiError(error: any): ApiErrorResponse {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      errors: error.response.data?.errors,
      status: error.response.status,
      code: error.response.data?.code,
    }
  }

  if (error.request) {
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
      code: 'NETWORK_ERROR',
    }
  }

  return {
    message: error.message || 'An unexpected error occurred',
    status: 0,
    code: 'UNKNOWN_ERROR',
  }
}

export function isApiError(error: any): error is ApiErrorResponse {
  return typeof error === 'object' && error !== null && 'message' in error && 'status' in error
}

// Export singleton instance
export const apiClient = new ApiClient()

export default fetchClient
