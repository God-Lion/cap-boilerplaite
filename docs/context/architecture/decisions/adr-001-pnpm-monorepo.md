# ADR-001: pnpm Monorepo with Workspace Packages

**Status**: Accepted | **Date**: 2025-03

## Context
The project needed to deliver a reusable authentication and identity management system
that could be consumed as discrete packages by different products. A key requirement was
that modules like `auth`, `admin`, and `landing` could be independently versioned and
optionally included without coupling the entire system.

## Decision
Use **pnpm workspaces** to organize the codebase as a monorepo with the `@cap/*` package
namespace. Each major concern (platform-core, layout, theme, modules) is its own package.
The `app/` directory serves as the integration shell that assembles packages at build time.

## Alternatives Considered
- **Single React app**: Rejected — creates tight coupling, makes it impossible to ship
  `@cap/module-auth` as a standalone package to other projects.
- **Npm workspaces / Yarn workspaces**: pnpm chosen for performance (hard links),
  stricter dependency isolation, and better handling of version conflicts per package.
- **Runtime Module Federation (Webpack 5 / Vite)**: Rejected as premature — adds significant
  infrastructure complexity. Static bundling with Vite is sufficient for current use case.

## Consequences
- ✅ Each `@cap/*` package has its own `package.json`, `tsconfig.json`, and can be published independently
- ✅ Clear boundaries prevent accidental coupling between modules
- ✅ pnpm's strict mode avoids phantom dependency issues
- ⚠️ Each package maintains its own `node_modules/` for version-conflicting deps (e.g., `@mui/lab`)
- ⚠️ TypeScript project references needed for cross-package type safety
- ⚠️ Adding a new package requires wiring: `pnpm-workspace.yaml`, root `package.json` deps, and `tsconfig`
