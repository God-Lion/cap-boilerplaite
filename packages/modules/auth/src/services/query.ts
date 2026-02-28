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
