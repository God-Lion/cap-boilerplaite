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
    register: '/api/auth/signup',
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    signin: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    csrfToken: '/api/auth/csrf-token',

    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    sso: {
      discover: '/api/auth/sso/discover',
    },
    verifyResetPassword: (email: string, signature: string) =>
      `/api/auth/reset-password/${email}?signature=${signature}`,

    verifyEmail: (email: string, signature: string) =>
      `/api/auth/verification/email/${email}?signature=${signature}`,
    resendVerification: '/api/auth/verification/email/resend',
    verifyEmailToken: (email: string, signature: string) =>
      `/api/auth/verification/email/${email}?signature=${signature}`,

    validateUser: (id: string | number, token: string) => `/api/auth/validate/${id}/${token}`,
    loginHistory: '/api/auth/login-history',
    securityLogs: '/api/auth/security-logs',

    session: '/api/auth/session',
    sessions: '/api/auth/sessions',
    revokeSession: (sessionId: string) => `/api/auth/sessions/${sessionId}`,
    revokeAllSessions: '/api/auth/sessions/revoke-all',
    trackFailedLogin: '/api/auth/track-failed-login',
    invitationDetails: '/api/auth/invitation-details',
    acceptInvitation: '/api/auth/accept-invitation',
    declineInvitation: '/api/auth/decline-invitation',
    mfa: {
      setup: '/api/auth/mfa/setup',
      verify: '/api/auth/mfa/verify',
      disable: '/api/auth/mfa/disable',
      recoveryCodes: '/api/auth/mfa/recovery-codes',
      recoveryVerify: '/api/auth/mfa/recovery-verify',
      verifyLogin: '/api/auth/mfa/verify-login',
      regenerateBackupCodes: '/api/auth/mfa/regenerate-backup-codes',
      totp: {
        enrollStart: '/api/mfa/totp/enroll',
        enrollConfirm: '/api/mfa/totp/enroll',
      },
      sms: {
        sendCode: '/api/auth/mfa/sms/send-code',
        verify: '/api/auth/mfa/sms/verify',
        disable: '/api/auth/mfa/sms/disable',
        verifyLogin: '/api/auth/mfa/sms/verify-login',
      },
    },
    passkey: {
      registerStart: '/api/auth/passkey/register/start',
      registerFinish: '/api/auth/passkey/register/finish',
      loginStart: '/api/auth/passkey/login/start',
      loginFinish: '/api/auth/passkey/login/finish',
    },
    passwordless: {
      send: '/api/auth/passwordless/send',
      verify: '/api/auth/passwordless/verify',
    },
    oidcDevice: {
      authorize: '/api/auth/oidc/device',
      verify: '/api/auth/device',
    },
    oidcInteraction: {
      get: (uid: string) => `/api/auth/oidc/interaction/${uid}`,
      login: (uid: string) => `/api/auth/oidc/interaction/${uid}/login`,
      consent: (uid: string) => `/api/auth/oidc/interaction/${uid}/consent`,
      confirm: (uid: string) => `/api/auth/oidc/interaction/${uid}/confirm`,
      abort: (uid: string) => `/api/auth/oidc/interaction/${uid}/abort`,
    },
    social: {
      redirect: (provider: string) => `/api/auth/social/${provider}/redirect`,
      callback: (provider: string) => `/api/auth/social/${provider}/callback`,
    },
    oidc: {
      userinfo: '/api/auth/oidc/userinfo',
      introspect: '/api/auth/oidc/introspect',
      revoke: '/api/auth/oidc/revoke',
      endSession: '/api/auth/oidc/end-session',
      par: '/api/auth/oidc/par',
      register: '/api/auth/oidc/register',
      backchannelLogout: '/api/auth/oidc/backchannel-logout',
    },
    saml: {
      sso: '/api/auth/saml/sso',
    },
  },

  // User
  user: {
    me: '/api/user/me',
    update: '/api/user/update',
    avatar: '/api/user/avatar',
    changeEmail: '/api/user/change-email',
    changePhone: '/api/user/change-phone',
    changePassword: '/api/user/change-password',
    activityTimeline: '/api/user/activity-timeline',
    securityStatus: '/api/user/security-status',
    destroy: '/api/user',
    preferences: '/api/user/preferences',
    verifyEmailChange: '/api/user/change-email/verify',
    activate: (id: string | number) => `/api/user/activate/${id}`,
    deactivate: (id: string | number) => `/api/user/deactivate/${id}`,
    suspend: (id: string | number) => `/api/user/suspend/${id}`,
    unsuspend: (id: string | number) => `/api/user/unsuspend/${id}`,
    mfa: {
      methods: '/api/user/mfa/methods',
    },
    passkeys: {
      index: '/api/user/passkeys',
      update: (id: string | number) => `/api/user/passkeys/${id}`,
      destroy: (id: string | number) => `/api/user/passkeys/${id}`,
    },
    linkAccount: '/api/user/linked-accounts',
    linkedAccounts: '/api/user/linked-accounts',
    unlinkAccount: (id: string | number) => `/api/user/linked-accounts/${id}`,
    tokens: {
      index: '/api/user/tokens',
      store: '/api/user/tokens',
      destroy: (id: string | number) => `/api/user/tokens/${id}`,
    },
    compliance: {
      export: '/api/user/compliance/export',
    },
    // deactivate: '/api/user/deactivate',
    // emailPreferences: '/api/user/email-preferences',
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

  // Translation
  translation: (code: string) => `/translate/${code}.json`,

  // Guest/Anonymous Routes
  guest: {
    analyzeAnonymous: '/api/admin/guest/analyze-anonymous',
    matchAnonymous: '/api/admin/guest/match-anonymous',
    getSession: (sessionId: string) => `/api/admin/guest/session/${sessionId}`,
    deleteSession: (sessionId: string) => `/api/admin/guest/session/${sessionId}`,
  },

  // SCIM Provisioning
  scim: {
    users: {
      list: '/scim/v2/Users',
      byId: (id: string) => `/scim/v2/Users/${id}`,
    },
    groups: {
      list: '/scim/v2/Groups',
      byId: (id: string) => `/scim/v2/Groups/${id}`,
    },
  },

  // Statistics (auth-relevant only)
  statistics: {
    overview: '/api/admin/statistics/summary',
    recentJobs: '/api/admin/statistics/recent-jobs',
    sessionStatistics: '/api/admin/statistics/session-statistics',
    trends: '/api/admin/statistics/trends',
  },

  // Dashboard
  dashboard: {
    overview: '/api/admin/dashboard',
    stats: '/api/dashboard/stats',
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
    sse: '/api/sse/notifications',
  },

  // Server-Sent Events (auth-relevant)
  sse: {
    scrapingProgress: (id: string | number) => `/api/sse/scraping/${id}`,
    analysisProgress: (id: string | number) => `/api/sse/analysis/${id}`,
  },

  // Admin Panel
  admin: {
    dashboard: '/api/admin/dashboard',
    users: {
      index: '/api/admin/users',
      store: '/api/admin/users',
      byId: (id: number) => `/api/admin/users/${id}`,
      activate: (id: number) => `/api/admin/users/${id}/activate`,
      deactivate: (id: number) => `/api/admin/users/${id}/deactivate`,
      suspend: (id: number) => `/api/admin/users/${id}/ban`,
      unsuspend: (id: number) => `/api/admin/users/${id}/unsuspend`,
      resetPassword: (id: number) => `/api/admin/users/${id}/reset-password`,
      resetMfa: (id: number) => `/api/admin/users/${id}/mfa-reset`,
      bulkAction: '/api/admin/users/bulk',
      assignRole: (id: number) => `/api/admin/users/${id}/assign-role`,
      impersonate: (id: number) => `/api/admin/users/${id}/impersonate`,
      unlock: (id: number) => `/api/admin/users/${id}/unlock`,
      sessions: (id: number) => `/api/admin/users/${id}/sessions`,
      ban: (id: number) => `/api/admin/users/${id}/ban`,
      unban: (id: number) => `/api/admin/users/${id}/unsuspend`,
    },
    appeals: {
      index: '/api/admin/appeals',
      resolve: (id: number) => `/api/admin/appeals/${id}/resolve`,
    },
    scim: {
      tokens: {
        index: '/api/admin/scim/tokens',
        store: '/api/admin/scim/tokens',
        destroy: (id: string | number) => `/api/admin/scim/tokens/${id}`,
      },
      config: '/api/admin/scim/config',
    },
    clients: {
      index: '/api/admin/clients',
      store: '/api/admin/clients',
      byId: (id: string) => `/api/admin/clients/${id}`,
      update: (id: string) => `/api/admin/clients/${id}`,
      destroy: (id: string) => `/api/admin/clients/${id}`,
      rotateSecret: (id: string) => `/api/admin/clients/${id}/rotate-secret`,
      branding: (id: string) => `/api/admin/clients/${id}/branding`,
    },
    saml: {
      config: '/api/admin/saml/config',
      metadata: '/api/admin/saml/metadata',
      uploadMetadata: '/api/admin/saml/metadata/upload',
    },
    ssf: {
      config: '/api/admin/ssf/config',
      updateConfig: '/api/admin/ssf/config',
      test: '/api/admin/ssf/test',
      broadcast: '/api/admin/ssf/broadcast',
    },
    jwks: {
      index: '/api/admin/jwks',
      show: (kid: string) => `/api/admin/jwks/${kid}`,
      store: '/api/admin/jwks',
      rotate: '/api/admin/jwks/rotate',
      destroy: (kid: string) => `/api/admin/jwks/${kid}`,
    },
    scopes: {
      list: '/api/admin/scopes',
      store: '/api/admin/scopes',
      byId: (id: number) => `/api/admin/scopes/${id}`,
      update: (id: number) => `/api/admin/scopes/${id}`,
      destroy: (id: number) => `/api/admin/scopes/${id}`,
    },
    domains: {
      verify: '/api/admin/domains/verify',
      check: '/api/admin/domains/check',
    },
    webhooks: {
      index: '/api/admin/webhooks',
      store: '/api/admin/webhooks',
      byId: (id: number) => `/api/admin/webhooks/${id}`,
      update: (id: number) => `/api/admin/webhooks/${id}`,
      destroy: (id: number) => `/api/admin/webhooks/${id}`,
      test: (id: number) => `/api/admin/webhooks/${id}/test`,
    },
    organizations: {
      index: '/api/admin/organizations',
      store: '/api/admin/organizations',
      byId: (id: number) => `/api/admin/organizations/${id}`,
      destroy: (id: number) => `/api/admin/organizations/${id}`,
      addMember: (id: number) => `/api/admin/organizations/${id}/members`,
      removeMember: (id: number, userId: number) =>
        `/api/admin/organizations/${id}/members/${userId}`,
      logo: (id: number) => `/api/admin/organizations/${id}/logo`,
      invite: (id: number) => `/api/admin/organizations/${id}/invite`,
      invitations: (id: number) => `/api/admin/organizations/${id}/invitations`,
      revokeInvitation: (orgId: number, invitationId: number | string) =>
        `/api/admin/organizations/${orgId}/invitations/${invitationId}/revoke`,
      policies: (id: number) => `/api/admin/organizations/${id}/policies`,
      impersonate: (id: number) => `/api/admin/organizations/${id}/impersonate`,
    },
    provisioning: {
      index: '/api/admin/provisioning',
      store: '/api/admin/provisioning',
      connectors: '/api/admin/provisioning',
      byId: (id: number) => `/api/admin/provisioning/${id}`,
      update: (id: number) => `/api/admin/provisioning/${id}`,
      destroy: (id: number) => `/api/admin/provisioning/${id}`,
      sync: (id: number) => `/api/admin/provisioning/${id}/sync`,
      logs: (id: number) => `/api/admin/provisioning/${id}/logs`,
      syncConnector: (id: number) => `/api/admin/provisioning/${id}/sync`,
      connectorLogs: (id: number) => `/api/admin/provisioning/${id}/logs`,
    },
    auditLogs: {
      index: '/api/admin/audit-logs',
      export: '/api/audit/logs/export',
      security: '/api/admin/security-logs',
      impersonation: '/api/admin/impersonation-logs',
      statistics: '/api/audit/statistics',
    },
    email: {
      templates: '/api/admin/email/templates',
      templateById: (id: string) => `/api/admin/email/templates/${id}`,
      preview: '/api/admin/email/preview',
      test: '/api/admin/email/test',
    },
    statistics: {
      overview: '/api/admin/statistics/summary',
      users: '/api/admin/statistics/users',
      mfa: '/api/admin/statistics/mfa',
      sessionStatistics: '/api/admin/statistics/session-statistics',
      trends: '/api/admin/statistics/trends',
    },
    impersonationLogs: '/api/admin/impersonation-logs',
    security: {
      health: '/api/admin/security/health',
    },
    docs: '/api/admin/docs',
    sandboxExecute: '/api/admin/sandbox/execute',
  },

  // RBAC & Permissions
  rbac: {
    roles: {
      list: '/api/admin/rbac/roles',
      stats: '/api/admin/rbac/roles/stats',
      store: '/api/admin/rbac/roles',
      byId: (id: number) => `/api/admin/rbac/roles/${id}`,
      update: (id: number) => `/api/admin/rbac/roles/${id}`,
      destroy: (id: number) => `/api/admin/rbac/roles/${id}`,
      permissions: (role: string) => `/api/admin/rbac/roles/${role}/permissions`,
      assignPermission: '/api/admin/rbac/roles/assign-permission',
      syncPermissions: (id: number) => `/api/admin/rbac/roles/${id}/permissions`,
      syncParents: (id: number) => `/api/admin/rbac/roles/${id}/parents`,
    },
    permissions: {
      list: '/api/admin/rbac/permissions',
      byId: (id: number) => `/api/admin/rbac/permissions/${id}`,
      store: '/api/admin/rbac/permissions',
      grant: '/api/admin/rbac/permissions/grant',
      revoke: '/api/admin/rbac/permissions/revoke',
    },
    users: {
      assignRole: '/api/admin/rbac/users/assign-role',
    },
    members: {
      addOverride: (id: number) => `/api/admin/rbac/members/${id}/overrides`,
      removeOverride: (id: number, pid: number) => `/api/admin/rbac/members/${id}/overrides/${pid}`,
    },
    accessPolicies: '/api/admin/rbac/access-policies',
  },

  // Security
  security: {
    cspReport: '/api/security/csp-report',
    cspReportAlt: '/api/security/report/csp',
    headersTest: '/api/security/security-headers-test',
  },

  // Audit Logging
  audit: {
    logs: '/api/admin/audit-logs',
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
