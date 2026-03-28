# @cap/module-admin

Admin UI module providing routing, layout, and navigation for the CAP Platform admin panel.

## Architecture

**This module is primarily a routing shell** that delegates screen implementations to `@cap/module-auth`. The admin module's responsibilities are:

1. **Route Management** - Defines admin routes and wraps them with `AdminRoute` guard
2. **Layout** - Applies the "admin" layout to all routes
3. **Navigation** - Provides nav items for the admin sidebar/header
4. **Dashboard** - Owns the dashboard and theme customizer screens
5. **Plugin System** - Hosts admin-specific plugins like `AdminDashboardPlugin`

### Delegation Pattern

Most admin screens (users, roles, permissions, SSO, SCIM, etc.) are implemented in `@cap/module-auth` and imported directly:

```typescript
// packages/modules/admin/src/routes/routes.tsx
import { 
  UserList, RoleList, PermissionRegistry, OIDCConfigBrowser, 
  SAMLConfigDashboard, JWKSManagement, SSFConfiguration, ...
} from '@cap/module-auth'
```

This delegation exists because:
- Authentication and authorization logic lives in `module-auth`
- Keeping screens in `module-auth` avoids circular dependencies
- The admin module can evolve independently as a pure UI shell

### Module-Owned Components

Only these screens are implemented directly in admin:
- `Dashboard` - Main admin dashboard (`src/modules/dashboard/`)
- `ThemeEditor` - Theme customization tool (`src/modules/theme-customizer/`)

## Directory Structure

```
src/
├── components/     # Shared admin components (dialogs, etc.)
├── hooks/          # Admin-specific query hooks (useAdminQuery.ts)
├── modules/        # Feature modules (dashboard, theme-customizer)
│   ├── dashboard/
│   ├── rbac/       # Placeholder for future RBAC customizations
│   ├── system/     # Placeholder for future system screen customizations
│   └── theme-customizer/
├── plugins/        # AdminDashboardPlugin
├── routes/         # Route definitions and path helpers
├── registry/       # Reserved for future admin registry extensions
├── services/       # API endpoints and query keys
└── types/          # Admin-specific TypeScript types
```

## Adding New Screens

### If the screen is auth-related:
1. Implement in `@cap/module-auth`
2. Export from `@cap/module-auth/src/index.ts`
3. Import and wrap with `AdminRoute` in `routes.tsx`

### If the screen is admin-specific:
1. Create implementation in `src/modules/<feature>/`
2. Export as lazy-loaded component
3. Add route in `routes.tsx`

## Hooks

`useAdminQuery.ts` provides React Query hooks for all admin API operations:
- Users (CRUD, ban/unban, impersonation)
- Organizations (CRUD, members, logos)
- OIDC Clients (CRUD, scopes, secrets)
- SAML/SCIM/SSF Configuration
- Audit Logs and Data Exports
- RBAC Member Overrides

## Related Packages

- `@cap/module-auth` - Screen implementations, auth services
- `@cap/platform-core` - API client, shared hooks, plugin registry
- `@cap/shared-types` - Type contracts
- `@cap/theme` - MUI theme and component overrides
