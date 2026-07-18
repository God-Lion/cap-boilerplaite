# Codebase Analysis Progress

## Project
- **Root:** `C:\Node.Js\proj\boilerplate`
- **Name:** `cap-monorepo` (`@cap/*` packages) — civil/digital-identity platform boilerplate (Landing + Auth modules active; Admin/User/CivilRegistry/DigitalId/KYC/MonitoringAlerts/BlockchainIdaas modules referenced but not present/active)
- **Tools used:** Filesystem MCP (user's machine) — read + write access confirmed, restricted to `C:\Node.Js\proj`.

## Methodology
3-phase process, technical-only scope (no business/cost/timeline recommendations). `.env` files (root and `app/`) noted but not opened — ask before reading if a future phase needs them.

## Phase 1 — Discovery & Architecture: COMPLETE
See `project-overview.md`, `architecture-analysis.md`.

## Phase 2 — Component Analysis: COMPLETE
Deliverables written to `analysis/`:
- `component-deep-dives/module-assembly.md` — `assembleApp()` implementation detail: mutable module-level registries, i18n last-write-wins vs. route/search first-write-wins precedence, dropped `layout` field, `null` catch-all route
- `component-deep-dives/auth-module.md` — full sub-module map (9 feature areas under `modules/`), the two parallel route-composition exports (`authRouteConfig` vs `authRoutes`), the three layout-tagging mechanisms and their reliability, MFA plugin/registry pattern, session-guard middleware behavior
- `component-deep-dives/theme-layout.md` — `@cap/theme` token/preset system (tenant-driven, glassmorphism as a first-class effect), `@cap/layout`'s `LayoutWrapper` selector logic and hydration-flicker handling
- `technical-issues.md` — consolidated findings, most notably a **confirmed routing/layout bug**: `assembleApp` never reads `module.routes` (only `module.authRouteConfig`), so `AuthModule`'s `routes: authRoutes` (built around `LayoutRouteWrapper`, which applies `layout: 'noLayout'`) is orphaned. Concrete effect: sign-in/sign-up/verification screens that rely on bare `<GuestRoute>`/plain elements + a config-level `layout: 'noLayout'` tag render inside the public site header/footer chrome instead of chrome-free, because nothing calls `updateLayoutOverride('noLayout')` for them. Routes built via `createAuthRoute`/`createAdminRoute` are unaffected (those wrapper components self-apply layout).

Also carried forward and re-confirmed: workspace/dependency drift (`packages/platform-api` and 7 `@cap/module-*` deps referenced but absent on disk).

## Phase 3 — Documentation & Recommendations: NOT STARTED
Candidates once user confirms scope:
- `comprehensive-codebase-guide.md` — full system doc for onboarding
- `technical-recommendations.md` — prioritized technical fixes (starting with the routing/layout bug and its 2-3 possible resolutions listed in `technical-issues.md`)
- `developer-onboarding-guide.md` — setup/dev workflow, key conventions (route-factory helpers, module registration steps, i18n dictionary registration pattern)

## Not Yet Investigated (any phase)
- `idaas-facade` and `domain-kernel/src/ports` contracts in the auth module
- `platform-store` slices beyond `settingsSlice` (auth, navigation, network, notifications, offlineQueue, profile, guest, preferences/)
- `packages/modules/document-processing` — not opened at all
- `packages/api-contracts`, `packages/auth-contracts`, `packages/shared-types`, `packages/platform-ui` — not opened at all
- `.env` files (root, `app/`) — intentionally not opened; ask user first

## How to Resume
Start a new chat with:
> "Continue codebase analysis - please read `analysis/codebase-analysis-progress.md` in C:\Node.Js\proj\boilerplate (via Filesystem MCP) to understand where we left off, then proceed with Phase 3."
