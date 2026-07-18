# Technical Issues Identified (Phase 2)

Technical-only findings, ordered roughly by concreteness/confidence. No effort or business-impact estimates included, per analysis scope.

## 1. `layout` tagging is dropped for plain (non-`createAuthRoute`/`createAdminRoute`) auth routes
**Where:** `packages/platform-core/src/assembly/index.tsx` (`assembleApp`) vs. `packages/modules/auth/src/routes/routeHelpers.tsx` (`LayoutRouteWrapper`) and `routes.tsx` (`authCoreRouteConfig`).

**What happens:** `assembleApp` builds `<Route path element>` using only `path` and `element` from each module's route config — the `layout` field is read into memory but never used. The only code that actually consumes `layout` to call `updateLayoutOverride()` for the `'noLayout'` case is `LayoutRouteWrapper`, which lives inside `authRoutes` (a `React.FC` export) — a code path that is not invoked anywhere; `assembleApp` is the only thing actually rendering auth routes in the running app.

**Affected routes (auth module, `authCoreRouteConfig`):** any entry with `layout: 'noLayout'` where the element is a bare JSX literal or a bare `<GuestRoute element={...} />` without a `layout` prop passed through — e.g. `Path.signinV2`, `Path.login`, `Path.adminLogin`, `Path.signup`, `Path.signupV2`, `Path.registration`, `Path.checkEmail`, `Path.emailVerification`/`Path.verifyEmail`, `Path.verificationLinkExpired`, `Path.registrationSuccess`, `Path.forgotPassword`, `Path.setNewPassword`, `Path.deviceCode`, `Path.joinOrganization`.

**Effect (confirmed by tracing `LayoutWrapper` in `@cap/layout`):** since the store's `layoutOverride` defaults to `'none'` and nothing sets it to `'noLayout'` for these routes, `LayoutWrapper` falls through to its default branch and renders them inside `publicLayout` (site header + footer) instead of chrome-free. Routes using `createAuthRoute(...)` or `createAdminRoute(...)` are unaffected, because those wrapper components (`AuthRoute`/`AdminRoute`) call `updateLayoutOverride` themselves, independent of `assembleApp`.

**Where it's not a problem:** routes built via `createAuthRoute`/`createAdminRoute` factory helpers correctly self-apply their layout regardless of `assembleApp`.

## 2. `CAPModule.routes` is populated but never read — confirms Issue #1
Confirmed by reading `packages/modules/auth/src/index.ts`: `AuthModule` is built with **both** `routes: authRoutes as any` (the `LayoutRouteWrapper`-based component) **and** `authRouteConfig: authRouteConfig as any` (the raw array). So `authRoutes`/`LayoutRouteWrapper` is not simply dead code left over — it's actively assigned onto the `CAPModule` object's `routes` field. The bug is on the consumer side: `assembleApp` (in `platform-core/src/assembly/index.tsx`) never destructures or calls `module.routes` at all — only `module.authRouteConfig`, `module.i18n`, `module.navItems`, `module.searchItems`. This looks like the result of a refactor where `assembleApp` was changed to flatten `authRouteConfig` directly (for single-`<Routes>`-tree correctness) but the `LayoutRouteWrapper`-based `routes`/`authRoutes` path was left in place on the module side without being wired up or removed. This is the root cause of Issue #1, stated more precisely: it's not that layout tagging was never implemented, it's that the component designed to apply it (`routes`/`authRoutes`) is orphaned by the current assembly implementation.

## 3. Workspace/dependency drift (carried over from Phase 1, now more precise)
- Root `package.json` lists `packages/platform-api` as a workspace; no such directory exists under `packages/`.
- `app/package.json` depends on `@cap/module-admin`, `@cap/module-user`, `@cap/module-civil-registry`, `@cap/module-digital-id`, `@cap/module-kyc`, `@cap/module-monitoring-alerts`, `@cap/module-blockchain-idaas` — none exist under `packages/modules`. These exactly match the commented-out imports in `AppAssembly.tsx`.
- **Interpretation:** most likely this is a deliberately trimmed "boilerplate" extract of a larger private monorepo (only Landing + Auth included), and the leftover `package.json` entries/comments are remnants rather than a broken checkout. Worth a quick confirmation (e.g. checking `pnpm-workspace.yaml` patterns or asking the maintainer) before treating it as an actual defect.

## 4. Minor: catch-all route renders `null`
`assembleApp`'s `<Route path='*' element={null} />` means unmatched URLs render a blank page (inside whichever layout happens to be active) rather than a dedicated 404/not-found screen.

## 5. Minor: i18n merge collision risk grows with module count
`assembleApp` registers each module's i18n bundle with `overwrite=true` into a shared `common` namespace (also separately flattened again in `app/src/Providers.tsx` at startup). With only 2 modules active today this is low-risk, but as more modules (KYC, Civil Registry, Digital ID, etc.) are enabled, identically-named keys across modules will silently overwrite one another with no warning, in module-array order.

## Not Yet Investigated (candidates for Phase 3 or a follow-up)
- `idaas-facade` and `domain-kernel/src/ports` contracts
- `platform-store` slices beyond `settingsSlice` (auth, navigation, network, notifications, offline queue, profile, guest)
- `document-processing` module (not opened at all)
- Whether the fix should be (a) make `assembleApp` also read `module.routes`/apply `LayoutRouteWrapper`, or (b) pass `layout` through into `GuestRoute`/bare elements directly, or (c) something else — a design decision, not just a bug report
