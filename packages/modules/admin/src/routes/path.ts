import { Path as AuthPath } from '@cap/module-auth'

export const Path = {
  ...AuthPath,
  admin: {
    ...AuthPath.admin,
    // Additional admin paths
    apiTokens: AuthPath.apiTokens?.dashboard || '/admin/api-tokens',
    policies: AuthPath.admin.policies || '/admin/organizations/:id/policies',
  },
  monitoring: {
    ...AuthPath.monitoring,
  },
  identity: {
    ...AuthPath.identity,
  },
  apiTokens: {
    ...AuthPath.apiTokens,
  },
  Root: AuthPath.admin.root,
  Dashboard: AuthPath.admin.dashboard,
  ThemeEditor: AuthPath.admin.themeEditor,
  // ThemeBuilder: AuthPath.admin.themeBuilder,
  themeBuilder: '/theme-builder',
}

export default Path
