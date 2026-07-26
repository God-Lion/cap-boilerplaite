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
- `component-deep-dives/domain-kernel-idaas.md` — `EventBus` wildcard subscriptions, dynamic concurrent execution, abstract service port contracts (`ports/`), `IdaasFacadeImpl` service mapping, and discoveries (unwired/inert client-side event bus, and Shared Signals and Events / SSF configurations).
- `component-deep-dives/react-table-virtualization.md` — `@tanstack/react-table` integration with `@tanstack/react-virtual`'s `useVirtualizer`, HTML-safe spacer row strategy (padding top/bottom table cells) vs absolute positioning/translation in lists/grids, dynamic row sizing (`measureElement`), and column-slicing CSS grid rendering for tiles.
- `component-deep-dives/state-session-hooks.md` — custom hook review for client state/cache synchronization (`useAuthQuery.ts`), user role normalization and numeric type coercion, secure logout clearing flow, and comparison of the two different `useSSE.ts` implementations (auth module's exponential backoff and ref safeguards vs platform-core's static reconnect and auto-close scrapers).
- `technical-issues.md` — consolidated findings, most notably a **confirmed routing/layout bug**: `assembleApp` never reads `module.routes` (only `module.authRouteConfig`), so `AuthModule`'s `routes: authRoutes` (built around `LayoutRouteWrapper`, which applies `layout: 'noLayout'`) is orphaned. Concrete effect: sign-in/sign-up/verification screens that rely on bare `<GuestRoute>`/plain elements + a config-level `layout: 'noLayout'` tag render inside the public site header/footer chrome instead of chrome-free, because nothing calls `updateLayoutOverride('noLayout')` for them. Routes built via `createAuthRoute`/`createAdminRoute` are unaffected (those wrapper components self-apply layout).

Also carried forward and re-confirmed: workspace/dependency drift (`packages/platform-api` and 7 `@cap/module-*` deps referenced but absent on disk).

## Phase 3 — Documentation & Recommendations: COMPLETE
Deliverables written to `analysis/`:
- `comprehensive-codebase-guide.md` — full system doc detailing Monorepo package topology, the compile-time `assembleApp` orchestration system, hexagonal auth domain structures, multi-tenancy contexts, and real-time Server-Sent Events (SSE).
- `developer-onboarding-guide.md` — developer setup instructions, pnpm commands, and step-by-step conventions for module development, i18n registration, route decorator factories, linting, and QA testing.
- `technical-recommendations.md` — prioritized roadmap detailing the route layout tagging bug and solutions, i18n key collisions namespace mitigations, monorepo dependency/workspace pruning, themed 404 pages, and dynamic table virtualization measurements.

## Not Yet Investigated (any phase)
- `platform-store` slices beyond `settingsSlice` (auth, navigation, network, notifications, offlineQueue, profile, guest, preferences/)
- `packages/modules/document-processing` — not opened at all
- `packages/api-contracts`, `packages/auth-contracts`, `packages/shared-types`, `packages/platform-ui` — not opened at all
- `.env` files (root, `app/`) — intentionally not opened; ask user first

## How to Resume
Start a new chat with:
> "Continue codebase analysis - please read `analysis/codebase-analysis-progress.md` in C:\Node.Js\proj\boilerplate (via Filesystem MCP) to understand where we left off, then proceed with Phase 3."
