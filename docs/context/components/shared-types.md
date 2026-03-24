# Shared Types Context (`@cap/shared-types`)

## Purpose
Provide shared TypeScript interfaces and types that are reused across the monorepo without runtime dependencies.

## Key Files
- `packages/shared-types/src/index.ts` — re-exports all types
- `packages/shared-types/src/types/` — definitions for auth, user, common, tenant, API payloads
- `packages/shared-types/tsconfig.json` — strict type-only configuration
- `packages/shared-types/package.json` — package metadata for `@cap/shared-types`

## Core Types
- `IUser`: user identity contract (id, name, email, roles, status)
- `IAuth`: authentication context (token, refreshToken, expiresAt, sessionId)
- `ITenant`: tenant info (tenantId, name, locale, theme)
- `ITheme`: tokenized theme fields used by `@cap/theme`

## Dependencies
- No runtime dependencies: compile-time only
- Depended on by: `@cap/platform-core`, `@cap/module-auth`, `@cap/module-admin`, `@cap/theme`, etc.

## Integration Points
- Used in API service request/response types across modules.
- Used in state slices and hooks to ensure consistent shared contracts.
- Included in E2E/test fixture types.

## Architecture Patterns
- Type re-export module pattern for simplified imports: `import { IUser } from '@cap/shared-types'`.
- Namespaced through simple naming: no IPAs, descriptive typings.
- When adding shared fields, ensure backward-compatible optional properties and keep extension patterns minimal.
