export const QUERY_KEYS = {
  // Admin
  admin: {
    all: ['admin'] as const,
    dashboard: ['admin', 'dashboard'] as const,
    users: {
      all: ['admin', 'users'] as const,
      index: ['admin', 'users'] as const,
      byId: (id: number) => ['admin', 'users', id] as const,
      list: (params: string) => ['admin', 'users', 'list', params] as const,
    },
    organizations: {
      all: ['admin', 'organizations'] as const,
      index: ['admin', 'organizations'] as const,
      byId: (id: number) => ['admin', 'organizations', id] as const,
    },
    clients: {
      all: ['admin', 'clients'] as const,
      index: ['admin', 'clients'] as const,
      byId: (id: string) => ['admin', 'clients', id] as const,
    },
    scopes: {
      all: ['admin', 'scopes'] as const,
      index: ['admin', 'scopes'] as const,
    },
    saml: {
      all: ['admin', 'saml'] as const,
      config: ['admin', 'saml', 'config'] as const,
    },
    scim: {
      all: ['admin', 'scim'] as const,
      config: ['admin', 'scim', 'config'] as const,
    },
    jwks: {
      all: ['admin', 'jwks'] as const,
      index: ['admin', 'jwks'] as const,
    },
    provisioning: {
      all: ['admin', 'provisioning'] as const,
      connectors: ['admin', 'provisioning', 'connectors'] as const,
    },
    ssf: {
      all: ['admin', 'ssf'] as const,
      config: ['admin', 'ssf', 'config'] as const,
    },
    auditLogs: {
      all: ['admin', 'audit-logs'] as const,
      index: ['admin', 'audit-logs'] as const,
    },
    impersonationLogs: ['admin', 'impersonation-logs'] as const,
    appeals: {
      all: ['admin', 'appeals'] as const,
      index: ['admin', 'appeals'] as const,
    },
    securityLogs: (params: string) => ['admin', 'security-logs', params] as const,
  },
  // RBAC
  rbac: {
    all: ['rbac'] as const,
    permissions: {
      all: ['rbac', 'permissions'] as const,
      index: ['rbac', 'permissions'] as const,
      byId: (id: number) => ['rbac', 'permissions', id] as const,
    },
    roles: {
      all: ['rbac', 'roles'] as const,
      index: ['rbac', 'roles'] as const,
      byId: (id: number) => ['rbac', 'roles', id] as const,
      permissions: (role: string) => ['rbac', 'roles', role, 'permissions'] as const,
    },
    accessPolicies: ['rbac', 'access-policies'] as const,
  },
} as const
