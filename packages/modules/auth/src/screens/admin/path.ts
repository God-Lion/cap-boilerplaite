const Path = {
  users: '/admin/users',
  userProfile: '/admin/users/:id',
  banManagement: '/admin/bans',
  impersonationLogs: '/admin/impersonation-logs',

  organizations: '/admin/organizations',
  organizationProfile: '/admin/organizations/:id',
  invitations: '/admin/organizations/:id/invitations',

  roles: '/admin/roles',
  roleDetail: '/admin/roles/:id',

  permissions: '/admin/permissions',
  policies: '/admin/organizations/:id/policies',

  applications: '/admin/developer/applications',
  appDetail: '/admin/developer/applications/:id',

  scopes: '/admin/developer/scopes',
  apiExplorer: '/admin/developer/api-explorer',
  webhooks: '/admin/developer/webhooks',

  exportAudit: '/admin/export-audit',

  // Provisioning
  provisioning: '/admin/provisioning',
  scim: '/admin/provisioning/scim',
  syncLogs: '/admin/provisioning/logs',
  connectorDetail: '/admin/provisioning/connectors/:id',

  events: '/admin/events',
  health: '/admin/health',
}

export default Path
