import { Path as AuthPath } from '@cap/module-auth'

export const Path = {
  ...AuthPath,
  // Mapping for backward compatibility with admin module's local Path definitions if they vary
  Root: AuthPath.admin.root,
  Dashboard: AuthPath.admin.dashboard,
  ThemeEditor: AuthPath.admin.themeEditor,
}

export default Path
