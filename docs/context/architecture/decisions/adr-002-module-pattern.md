# ADR-002: Feature Module Pattern with Sub-Module Decomposition

**Status**: Accepted | **Date**: 2025-03

## Context
The auth system is large and growing. Putting everything in a single package would create
a monolithic blob. The team needed a way to add new auth capabilities (e.g., passkeys,
SSO, provisioning) without touching unrelated code, while still shipping one `@cap/module-auth`
package that consumers can depend on.

## Decision
Decompose `@cap/module-auth` into **8 named sub-modules** (directories under `src/modules/`),
each with a strict internal structure: `components/`, `hooks/`, `middlewares/`, `screens/`,
`services/`, `types/`, `utils/`, and optionally `store/`.

Each sub-module exposes its public API only through its `index.ts`.
The top-level `packages/modules/auth/src/index.ts` re-exports from all sub-modules.

The same pattern is applied to `module-admin`.

## Alternatives Considered
- **Flat file structure**: Rejected — at 300+ screens, a flat structure is unmaintainable.
- **Separate npm packages per sub-module**: Rejected — over-engineering; sub-module splits
  would happen too frequently, requiring constant version bumps and publish cycles.
- **Domain-only separation (no screen split)**: Rejected — without collocating screens with
  their domain logic, navigation between layers becomes confusing.

## Consequences
- ✅ New auth capabilities are added as new sub-modules (e.g., `biometric-service/`)
- ✅ Each sub-module is independently testable; `vitest.config.ts` at module root covers all
- ✅ Clear ownership: team members can own a sub-module end-to-end
- ✅ `domain-kernel/` and `idaas-facade/` pattern enables clean separation from HTTP/UI
- ⚠️ Adding a new screen requires: component → hook → service → route → index.ts re-export
- ⚠️ Sub-modules must NOT import from sibling sub-modules; use `platform-core` for shared needs

## New Module Checklist
1. Create `src/modules/[name]/` with standard folder structure
2. Add `index.ts` exporting public API
3. Add `routes/routes.tsx` with React Router v6 routes
4. Register routes in `src/routes/routes.tsx` (top-level aggregator)
5. Add `package.json` if sub-module has unique dependencies
6. Add i18n dictionaries to `src/data/dictionaries/`
7. Export from `packages/modules/auth/src/index.ts`
