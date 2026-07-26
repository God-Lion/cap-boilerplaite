# Codebase Analysis & Maintenance Log

## Project Summary
- **Root:** `C:\Node.Js\proj\boilerplate`
- **Name:** `cap-monorepo` (`@cap/*` packages) — multi-tenant civil/digital-identity platform boilerplate.

---

## Architecture & Maintenance Updates (Recent Milestones)

### 1. Dedicated Not Found (404) Route
- **File:** `packages/platform-core/src/assembly/index.tsx`
- **Details:** Mapped wildcard route (`*`) in `assembleApp()` to a dedicated `<NotFound />` component in `@cap/platform-core` wrapped in `<LayoutRouteWrapper element={<NotFound />} />`. Avoids blank null screens on unmatched URLs.

### 2. Isolated i18n Resource Bundles
- **File:** `packages/platform-core/src/assembly/index.tsx`
- **Details:** Updated `assembleApp()` to register module `i18n` bundles strictly by module namespace (`moduleNs = module.id || module.name || 'common'`). Eliminates key collision risk across modules.

### 3. Route Layout Association Fix
- **File:** `packages/platform-core/src/assembly/index.tsx`, `packages/layout/src/components/wrappers/LayoutRouteWrapper.tsx`
- **Details:** Moved `LayoutRouteWrapper` to `@cap/layout` and updated `assembleApp()` to wrap every route in `<LayoutRouteWrapper element={element} layout={layout} />`. Preserves layout metadata (`noLayout`, `admin`, `public`) across all route configs.

### 4. Activated DDD Event Bus
- **Files:** `packages/modules/auth/src/modules/authentication-core/services/auth.service.ts`
- **Details:** Injected `eventBus.publish()` calls across key authentication lifecycle hooks (`UserAuthenticated`, `SessionCreated`, `TokenIssued`, `SessionRevoked`, `TokenRefreshed`, `AuthenticationFailed`), ensuring domain events publish on state changes.

### 5. Dynamic Table Virtualization Measurements
- **Files:** `packages/layout/src/components/ui/virtualized/VirtualizedTable.tsx`
- **Details:** Bound `measureElement` ref to `TableRow` elements to accurately calculate dynamic row heights in TanStack Virtualizer, resolving table height jumps.

---

## Documentation Artifacts
- `analysis/project-overview.md` — system overview
- `analysis/architecture-analysis.md` — platform architecture breakdown
- `analysis/technical-issues.md` — tracked technical issues and resolution log
- `analysis/component-deep-dives/` — detailed component analysis for assembly, auth, theme, domain kernel, virtualization, and session state
- `packages/platform-core/src/assembly/README.md` — assembly module API and architecture guide
