# Admin Module Context (`@cap/module-admin`)

## Purpose
`@cap/module-admin` provides the tenant administrator dashboard, user and policy management, and theme customizer integration.

## Key Files
- `packages/modules/admin/src/index.ts` — module entrypoint exports
- `packages/modules/admin/src/modules/dashboard/` — dashboard cards and metrics
- `packages/modules/admin/src/modules/theme-customizer/` — theme editor integration with `@cap/theme-admin` APIs
- `packages/modules/admin/src/routes/routes.tsx` — route definitions for admin pages
- `packages/modules/admin/src/data/dictionaries/{en,ar,fr}.json` — module-level i18n strings

## Dependencies
- `@cap/platform-core` (API client, auth checks, tenant context)
- `@cap/theme` and `@cap/theme-admin` (theme editing and styling)
- `@cap/shared-types` (IUser, IAuth, ITheme) for typed contracts
- `@cap/layout` (shell wrappers such as `AdminLayout`)

## Integration Points
- Exposes `adminRoutes` for `app` to mount under `/admin`
- Uses `AdminRoute` guard from `module-auth` to enforce admin role
- Publishes and subscribes to tenant theme updates via `TenantThemeService`
- Contains hooks: `useAdminDashboard`, `useThemeCustomizer`, `useAdminUsers`

## Architecture Patterns
- Module substructure pattern: `modules/<feature>/` with `screens/`, `hooks/`, `services/`
- Data-layer separation: `services/*.service.ts` => API endpoints + query hooks (TanStack Query)
- Local slice (if any) is minimal; prefers `platform-core` shared state for global admin data and settings.
- Uses `i18next` for translations.
