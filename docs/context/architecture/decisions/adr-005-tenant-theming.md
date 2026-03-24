# ADR-005: Tenant Theming Strategy

Status: Accepted | Date: 2026-03-23

## Context
The product supports multi-tenant branding. The front end must adapt colors, typography, and appearance dynamically per tenant while staying performant and safe.

## Decision
Adopt theme tokens and runtime theme injection via `@cap/theme` and `@cap/theme-admin`:

- `@cap/theme` defines core token contract and theme system interfaces.
- `@cap/theme-admin` provides UI editor and tenant theme payload builder.
- `@cap/platform-core` includes `tenantThemeService` to fetch tenant theme config and cache it.
- `app` sets MUI theme in `ThemeProvider` using values from `tenantThemeContext`.

## Alternatives Considered
1. CSS variable overrides in raw CSS: rejected due to inconsistent component-level MUI style support.
2. One-off theme per module: rejected due to complexity and poor UX for a tenant-wide theming contract.

## Consequences
- Positive: consistent theming across modules, centralized token naming (e.g., `primary`, `secondary`, `background`, `surface`, `borderRadius`).
- Positive: tidy path for preview + fallback theme while loading.
- Negative: more complexity in onboarding new token names and schema migrations.

## Implementation details
- Token schema in `packages/theme/src/types/theme.types.ts` and JSON reference in `packages/theme/src/theme-tokens.json`.
- Fallback theme from `packages/theme/src/default-theme.ts`.
- Tenant theme mutations apply with CSS variables plus MUI `createTheme`, allowing `sx`/`styled` to consume tokens.
- In `app/src/Providers.tsx`, wrap with `TenantThemeProvider` reading `tenantId` from route or auth payload.
- Persist theme to local storage for speed and disable block on initial render using server side render fallback values where applicable.
