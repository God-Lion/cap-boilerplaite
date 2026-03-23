const Path = {
  dashboard: '/auth/api-tokens',
  createBasic: '/auth/api-tokens/create/basic',
  createRestrictions: '/auth/api-tokens/create/restrictions',
  details: '/auth/api-tokens/:tokenId',
  display: '/auth/api-tokens/:tokenId/display',
  actions: '/auth/api-tokens/:tokenId/actions',
  securityWarning: '/auth/api-tokens/security-warning',
  roles: '/admin/roles',
  roleDetail: '/admin/roles/:id',
  permissions: '/admin/permissions',
  policies: '/admin/policies',
  applications: '/admin/applications',
  appDetail: '/admin/applications/:id',
  scopes: '/admin/scopes',
  apiExplorer: '/admin/api-explorer',
  webhooks: '/admin/webhooks',
  machineIdentities: '/admin/machine-identities',
  domainVerification: '/admin/domain-verification',
}

export default Path
