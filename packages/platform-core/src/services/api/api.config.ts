// src/shared/api/config.ts

const getBaseURL = (): string => {
  const envApiUrl = import.meta.env.VITE_API_URL
  const isDev = import.meta.env.DEV
  const isProd = import.meta.env.PROD

  // Always return a valid URL - never empty string
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
  timeout: import.meta.env.VITE_API_TIMEOUT ? Number(import.meta.env.VITE_API_TIMEOUT) : 30000,
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
    verifyEmailToken: (token: string) => `/api/auth/verify-email/${token}`,
    validateUser: (id: string | number, token: string) => `/api/auth/validate/${id}/${token}`,
    mfa: {
      setup: '/api/auth/mfa/setup',
      verify: '/api/auth/mfa/verify',
      disable: '/api/auth/mfa/disable',
    },
    changePassword: '/api/user/change-password',
    sessions: '/api/auth/sessions',
    revokeSession: (sessionId: string) => `/api/auth/sessions/${sessionId}`,
    revokeAllSessions: '/api/auth/sessions/revoke-all',
    loginHistory: '/api/auth/login-history',
    securityLogs: '/api/auth/security-logs',
    passkey: {
      registerStart: '/api/auth/passkey/register/start',
      registerFinish: '/api/auth/passkey/register/finish',
      loginStart: '/api/auth/passkey/login/start',
      loginFinish: '/api/auth/passkey/login/finish',
    },
  },

  // User
  user: {
    list: '/user',
    byId: (id: number) => `/user/${id}`,
    byUserType: (userTypeId: number) => `/users/${userTypeId}`,
    updateNames: '/users/update/names',
    updateEmail: '/update/email',
    updatePhoto: (id: number) => `/photoProfile/${id}`,
    settings: '/settings',
    deactivate: '/api/user/deactivate',
    emailPreferences: '/api/user/email-preferences',
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
    // cspell:ignore pitr
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
