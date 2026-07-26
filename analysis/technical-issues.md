# Technical Issues & Resolutions Log

Technical findings and resolution status tracking across the platform.

## 1. [RESOLVED] `layout` tagging is dropped for plain auth routes
- **Status:** FIXED
- **Resolution:** Moved `LayoutRouteWrapper` to `@cap/layout` package and updated `assembleApp()` in `packages/platform-core/src/assembly/index.tsx` to wrap every route in `<LayoutRouteWrapper element={element} layout={layout} />`. Layout metadata (`layout: 'noLayout'`, `layout: 'admin'`, etc.) is now preserved across all route configurations.

## 2. [RESOLVED] i18n merge collision risk across modules
- **Status:** FIXED
- **Resolution:** Updated `assembleApp()` in `packages/platform-core/src/assembly/index.tsx` to register each module's `module.i18n` bundle under an isolated module namespace (`moduleNs = module.id || module.name || 'common'`). This eliminates global translation key collisions.

## 3. [RESOLVED] Catch-all route renders `null`
- **Status:** FIXED
- **Resolution:** Created dedicated `NotFound` component in `@cap/platform-core` (`packages/platform-core/src/components/NotFound.tsx`) and mapped wildcard path `*` to `<Route path='*' element={<LayoutRouteWrapper element={<NotFound />} />} />`.

## 4. [RESOLVED] Inert DDD Event Bus
- **Status:** FIXED
- **Resolution:** Injected `eventBus.publish()` calls into authentication lifecycle services (`auth.service.ts` publishing `UserAuthenticated`, `SessionCreated`, `TokenIssued`, `SessionRevoked`, `TokenRefreshed`, `AuthenticationFailed`), enabling event subscribers to trigger domain workflows on state changes.

## 5. [RESOLVED] Table Virtualization Row Height Jumps
- **Status:** FIXED
- **Resolution:** Bound `@tanstack/react-virtual`'s `measureElement` ref to `TableRow` elements in `VirtualizedTable.tsx` so dynamic row heights are accurately measured, eliminating layout shifts and height jumping.

## 6. Workspace/dependency drift (Open / Low Priority)
- **Status:** OPEN (Expected Monorepo Scaffolding)
- Root `package.json` references `packages/platform-api` as a workspace.
- `app/package.json` lists optional/uninstalled modules (`@cap/module-admin`, `@cap/module-user`, `@cap/module-civil-registry`, etc.) matching commented imports in `AppAssembly.tsx`.
