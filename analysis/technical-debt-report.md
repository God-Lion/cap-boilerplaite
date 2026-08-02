# CAP Boilerplate — Technical Debt Report

Companion to `architecture-report.md`. This document is the UI/UX audit (against MUI/DESIGN_SYSTEM.md practices) and the React code-quality audit, plus a consolidated debt inventory. Every item below was confirmed by reading the actual file — none are inferred from documentation alone. Severity is rated by **real-world impact**, not by how easy the fix is (ease is called out separately and feeds `improvement-roadmap.md`).

---

## 1. UI/UX Review (Material UI Practices)

### 1.1 Strengths worth preserving
- **Token discipline is real in most sampled screens.** `SignInV2.tsx` and the theme package consistently use `sx={{ color: 'text.secondary', bgcolor: 'background.paper' }}` and `theme.palette.*` / `alpha()` rather than hardcoded hex, matching `DESIGN_SYSTEM.md` §1's "Correct" example almost exactly.
- **Accessibility touches beyond the baseline:** `autoComplete='username webauthn'` + `usePasskeyAutofill` wiring up conditional WebAuthn UI, `inputMode: 'numeric'` on the MFA digit boxes, visible `:focus`/`:hover` states with explicit `boxShadow` rings, `<SkipToContent />` at the app root, and semantic landmark structure in the layout shells. These are genuinely senior-level details many boilerplates skip.
- **`LayoutWrapper`'s hydration-behind-a-spinner pattern** (see architecture-report.md §4.4) is good UX engineering, not just good code.

### 1.2 Finding: sign-in form ships with a fake admin credential as the default value
`packages/modules/auth/src/modules/authentication-core/screens/signin/SignInV2.tsx`:
```ts
const DEFAULT_FORM_VALUES: LoginRequest = {
  email: 'admin@example.com',
  password: 'password',
  // email: 'mascayiti@gmail.com',
  // password: 'mascayiti',
  rememberMe: false,
}
```
The production sign-in screen's `useForm` default values pre-fill a real-shaped admin email and the literal string `password` on every load, and a second, commented-out personal-looking credential pair sits directly below it. Regardless of whether this was for local demo convenience, it: (a) trains a habit that is one accidental deploy away from shipping a pre-filled admin login to a real tenant, (b) is dead/debug code left in a shipped screen, and (c) is a bad first impression for any developer or reviewer opening this file. **Recommend:** empty defaults (or an env-gated demo-fill helper that only runs when `import.meta.env.DEV`), and delete the commented block.

### 1.3 Finding: hardcoded French UI string in a shared, locale-agnostic component
`packages/layout/src/components/ui/table/Table.tsx`:
```tsx
<TablePagination
  labelRowsPerPage='Lignes par page'
  ...
/>
```
This is `@cap/layout`'s generic, reusable table wrapper — consumed across modules regardless of active locale — yet the pagination label is hardcoded French instead of routed through the `i18next`/dictionary system every other reviewed screen uses (`t('...')`). An English- or Arabic-locale tenant sees "Lignes par page." This directly contradicts the framework's own i18n-first, multi-tenant principle and is a one-line fix.

### 1.4 Finding: duplicated redirect-by-role logic (4×) inside one screen
Inside `SignInV2.tsx`, the exact same pattern —
```ts
const ADMIN_ROLES: Roles[] = [Roles.ADMIN, Roles.SUPERADMINEMPLOYEE, Roles.SUPERADMIN]
let redirectPath = '/auth/account'
if (userRole && ADMIN_ROLES.includes(userRole)) redirectPath = Path.admin.users
else if (userRole === Roles.PARTICIPANT) redirectPath = '/provider'
```
— appears independently in `loginMutation.onSuccess`, `mfaVerifyMutation.onSuccess`, `passkeyLoginMutation.onSuccess`, and `handlePasskeyAutofillSuccess`. This is a textbook DRY violation with a maintenance trap: adding a role tier or changing a redirect target means finding and editing it four times, and a future edit that only catches three of the four introduces a silent inconsistency. **Recommend:** extract `resolveRedirectPathForUser(user): string` once (this module already has `services/` and `utils/` folders to host it).

### 1.5 Finding: `SignInV2.tsx` mixes five concerns in one 500+-line component
Password sign-in, SSO discovery (debounced), MFA verification state machine, passkey login + conditional autofill, and account-lockout countdown are all implemented inline in one file/component. Beyond the duplication in §1.4, this makes the component hard to test in isolation and hard to reason about (the `mode: 'login' | 'mfa' | 'locked'` state machine and its transitions are easy to lose track of at this length). **Recommend:** split into `useSignInFlow()` (state machine + mutations) and presentational sub-components per mode (`MfaStep`, `LockedStep`, `CredentialsStep`) — the module already has a `components/shared/auth/` folder that is the natural home for these.

### 1.6 Finding: hand-rolled OTP input duplicates an already-installed dependency
The MFA 6-digit code entry in `SignInV2.tsx` is built from six separate `TextField`s with manual `useRef` array focus-management (`handleMfaKeyDown`, `handleMfaDigitChange`). `app/package.json` already depends on `react-otp-input` (`^3.1.1`), a purpose-built component for exactly this. Either the dependency is unused elsewhere too (worth an audit — dead dependency = bundle weight for nothing) or it's used inconsistently across MFA/OTP touchpoints. **Recommend:** standardize on one approach.

### 1.7 Minor: duplicate `ref` target in `Table.tsx`
```tsx
<Card ref={ref} sx={{ p: 0 }}>
  ...
  <TableComponent ref={ref} ... />
```
The same forwarded `ref` is assigned to two different elements (`Card` and `TableComponent`) in `packages/layout/src/components/ui/table/Table.tsx`. Only one assignment will "stick" depending on render/commit order — likely an oversight from copy/paste. Low impact (nothing currently seems to depend on reading this ref), but a latent bug if a consumer starts relying on `ref.current`.

---

## 2. Code Quality & Tooling Audit

### 2.1 Phantom packages referenced in *live, enforced* configuration
`eslint.config.js` (root) — the actual linting layer-boundary config, not a comment — lists packages that don't exist on disk: `@cap/civil-registry`, `@cap/module-admin`, `@cap/module-kyc`, `@cap/module-digital-id`, `@cap/module-blockchain-idaas`, `@cap/module-monitoring-alerts`, `@cap/module-user`. This isn't purely cosmetic: these entries are inert today (rules referencing non-existent import specifiers never fire), but they will silently start enforcing boundaries the moment someone scaffolds a module with one of these exact names, based on assumptions nobody currently working on the repo actually made. **Recommend:** either remove them now, or — better, given they look like a genuine near-term roadmap (KYC, digital ID, blockchain IDaaS all show up elsewhere in module-deep-dive docs) — leave a one-line comment above each documenting that it's provisioned ahead of the package's creation, so a future reader doesn't mistake it for drift.

### 2.2 Broken / no-op pre-commit hook
`app/package.json`:
```json
"lint-staged": {
  "src/app/**/*.{ts,tsx}": ["npm run validate:isolation", "npm run validate:documentation"],
  "**/*.{ts,tsx}": ["npm run validate:types"]
}
```
Two independent problems:
1. **The glob is wrong.** The app's source lives at `app/src/**`, not `src/app/**` — no file in the repo matches that pattern, so the first rule (and both its scripts) never actually runs on any commit.
2. **`validate:documentation` doesn't exist.** The `scripts` block in the same `package.json` has no `validate:documentation` entry — if the glob above ever did match a file, the hook would fail with `npm error Missing script: "validate:documentation"`.

Net effect: this pre-commit safeguard is currently a complete no-op, silently. It gives a false sense of enforcement. **Recommend:** fix the glob to `app/src/**/*.{ts,tsx}` and either add the missing script or remove that hook entry — this should be a 10-minute fix.

### 2.3 TypeScript version drift across package manifests
Confirmed by direct comparison of `peerDependencies`/`devDependencies` across `package.json` files:

| Package | Declares (peer) | Declares (dev) |
|---|---|---|
| `app` | `typescript: "~5.7.3"` | `typescript: "~5.7.3"` |
| `packages/platform-core` | `typescript: "~5.7.3"` | `typescript: "^6.0.2"` |
| `packages/theme` | `typescript: "~5.9.3"` | `typescript: "^7.0.2"` |
| `packages/layout` | *(none declared)* | `typescript: "^7.0.2"` |

Three different major/minor ranges are in play depending on which package's `devDependencies` pnpm happens to hoist/resolve at install time. This is exactly the class of "stale version reference" drift already being tracked and corrected in the in-flight documentation overhaul (per prior session notes) — this confirms the drift is real in the *package manifests themselves*, not only in prose docs. **Recommend:** pin one TypeScript range at the workspace root and remove the per-package overrides unless a specific package has a proven reason to diverge.

### 2.4 `any` typing shows up specifically where the coding standard says it shouldn't
`AGENTS.md` §4 states "Avoid `any`. Use strict TypeScript interfaces." Confirmed violations in exactly the areas that matter most (API responses, cross-cutting route config, role resolution):
- `packages/modules/auth/src/routes/routeHelpers.tsx` — `createAuthRoute(path, element, options: { requiresVerification?: boolean; layout?: any })`. This is the shared factory every auth route goes through; its `layout` field being `any` means the whole `RouteLayout` union (see architecture-report.md §4.1) has no compile-time protection at its single most common call site.
- `SignInV2.tsx` — `onError: async (error: any) =>` (×3 mutations), `(userData?.role || userData?.user?.role) as any`, `(import.meta as any).env?.VITE_API_URL`. The `import.meta` cast in particular suggests a Vite env-typing gap for this module rather than a one-off shortcut — worth checking whether `env.d.ts` is actually referenced from this package's `tsconfig.json`.

This isn't a call to chase every `any` in the repo — it's a note that the *specific* places already flagged as architecturally significant (§4.1's layout typing gap) are also where type safety has already been given up, which compounds the risk of that bug resurfacing after a fix.

### 2.5 Documentation currency (already tracked, confirmed still accurate)
`technical-recommendations.md` §1 and §4 describe `assembleApp`'s *pre-fix* behavior (dropped `layout` prop, `<Route path='*' element={null} />`). Both are resolved in current code, confirmed directly against `packages/platform-core/src/assembly/index.tsx` during this review, and already logged as fixed in `technical-issues.md` #1/#3. No action needed beyond an annotation — listed here only so this report and `technical-recommendations.md` don't appear to contradict each other.

---

## 3. Severity Summary

| # | Finding | File(s) | Impact | Effort |
|---|---|---|---|---|
| A | `layout: 'vertical'/'horizontal'` documented but non-functional | `LayoutWrapper.tsx`, `LayoutRouteWrapper.tsx` (×2), `settingsSlice.ts` | High — silently breaks any module built per the official guide | Medium |
| B | Duplicate `LayoutRouteWrapper` implementations, already diverged | `platform-core/src/components/`, `layout/src/components/wrappers/` | Medium — drift risk compounds every future fix | Low |
| C | Inconsistent per-route `layout` declarations → layout bleed | `user-directory/routes.tsx`, `session-manager/routes.tsx` | Medium — reproducible, user-visible | Low–Medium |
| D | Hardcoded admin credential as sign-in form default | `SignInV2.tsx` | Medium — security hygiene / bad precedent | Trivial |
| E | Hardcoded French string in shared table component | `layout/.../Table.tsx` | Medium — breaks i18n contract for non-FR tenants | Trivial |
| F | Broken/no-op pre-commit hook | `app/package.json` | Medium — false sense of enforcement | Trivial |
| G | Phantom packages in live ESLint layering config | `eslint.config.js` | Low today, latent | Trivial |
| H | TypeScript version drift across manifests | multiple `package.json` | Low–Medium — build reproducibility risk | Low |
| I | 4× duplicated role-redirect logic | `SignInV2.tsx` | Low–Medium — maintenance trap | Low |
| J | `any` typing at architecturally significant call sites | `routeHelpers.tsx`, `SignInV2.tsx` | Low–Medium — compounds finding A | Low–Medium |
| K | Status colors (`error`/`warning`/`success`/`info`) not fully tenant-tokenized | `composeMuiTheme.ts` | Low–Medium — tenant branding completeness | Low |
| L | `SignInV2.tsx` is a 500+ line, 5-concern component | `SignInV2.tsx` | Low — maintainability only | Medium |
| M | Possibly-dead `mergeDeep` utility | `theme/src/utils/mergeTheme.ts` | Low | Trivial (verify) |
| N | Duplicate `ref` target | `layout/.../Table.tsx` | Low, latent | Trivial |
| O | DESIGN_SYSTEM.md doesn't mention `stylis-plugin-rtl` strategy | doc only | Low — contributor confusion | Trivial |

Sequenced fix plan: `improvement-roadmap.md`.
