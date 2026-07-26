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

## 6. Workspace/dependency drift
- **Status:** RESOLVED
- **Resolution:** Removed legacy npm `workspaces` from `package.json` and dropped the nonexistent `platform-api` from `pnpm-workspace.yaml`. The `app/package.json` dependencies on unimplemented modules remain commented out in code as scaffolding.

## 7. Security Audit Remediation
- **Status:** RESOLVED
- **Resolution:** All 15 findings from the `CAP_Boilerplate_Security_Audit_Report.txt` have been addressed:
  - **Critical:** Untracked `.env` files; implemented strict RBAC in `PermissionCheckerService`.
  - **High:** Deprecated the plaintext `SecureSessionManagementService` in favor of `authSlice`; enforced `VITE_STORAGE_ENCRYPTION_KEY` checks.
  - **Medium/Low:** Enforced `POST` requests for sensitive actions (logout, verifications); exact route matching in `PrivateRoute`; replaced `Math.random` with `crypto.randomUUID()`; implemented strict NIST-style password policies and `SameSite/Secure` cookies; removed sensitive `console.log` statements.
