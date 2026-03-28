# Architecture Documentation

This document explains the key architectural decisions in this monorepo.

## Package Structure

```
packages/
├── admin/              # Admin-specific components and hooks
├── auth/               # Authentication and authorization module
├── layout/            # Layout components
├── platform-core/      # Core platform functionality
├── shared-types/       # Shared TypeScript types
├── theme/              # Theming system
└── modules/
    ├── identity/       # Identity management
    ├── landing/        # Landing pages
    ├── user/           # User management
    └── ...
```

## Key Design Decisions

### 1. Why Admin Delegates Screen Implementations to @cap/module-auth

The `@cap/modules/admin` package acts as a **plugin orchestrator** that delegates implementation details to `@cap/module-auth`. This is an intentional **plugin pattern**:

- **Admin** defines the navigation structure, routes, and aggregates hooks
- **Auth Module** provides the actual screen implementations
- This separation allows the auth module to be reused in non-admin contexts

This pattern follows the **Facade Pattern**: `@cap/modules/admin` exposes a unified API while `@cap/module-auth` contains the actual implementations.

### 2. Difference Between platform-core/src/theme/ and @cap/theme

| Aspect | `platform-core/src/theme/` | `@cap/theme` |
|--------|---------------------------|--------------|
| **Purpose** | Runtime theme generation for app | Design token definitions and MUI theme factory |
| **Dependencies** | MUI, platform-core services | Pure type definitions, no runtime deps |
| **Usage** | Called during app bootstrap | Used by consumers to create themes |
| **Contains** | `theme()` function, spacing, shadows | `composeMuiTheme`, `TenantThemeConfig`, `createBaseMuiTheme` |

**When to use each:**
- Use `platform-core/src/theme/` when you need to generate a complete MUI theme at runtime with current settings
- Use `@cap/theme` when you need design tokens, theme configuration types, or the `composeMuiTheme` factory

### 3. What "Assembly" Means in platform-core/src/assembly/

The `assembly/` directory contains **cross-cutting concerns** that orchestrate multiple services:

- **Route assembly**: Combines routes from multiple modules into a unified route tree
- **Service assembly**: Wires together service dependencies
- **Plugin assembly**: Coordinates plugin registration and lifecycle

Think of it as the "glue code" that holds the platform together.

### 4. Which Table Component to Use

The `@cap/theme` package provides multiple table options:

| Component | Purpose | When to Use |
|-----------|---------|--------------|
| `DataGrid` (MUI X) | Advanced data table with sorting, filtering, pagination | Large datasets, complex use cases |
| `SimpleTable` | Basic table for simple data display | Simple lists with minimal features |
| `TableContainer` | MUI TableContainer wrapper | When you need full control over table structure |
| `ServerTable` | Server-side paginated table | Large datasets fetched from API |

**Recommendation:** Use `DataGrid` for most admin/data-heavy interfaces. Use `SimpleTable` for settings pages or small lists.

### 5. Why Are services/hooks/ and src/hooks/ Split in platform-core?

This is an intentional separation based on **coupling**:

| Directory | Contents | Coupling Level |
|-----------|----------|-----------------|
| `src/hooks/` | Generic, reusable hooks | Low (can be used anywhere) |
| `src/services/hooks/` | Hooks that depend on services | Higher (require service context) |

The `services/hooks/` directory contains hooks that:
- Depend on service singletons
- Require specific service initialization
- Are tightly coupled to service implementations

### 6. Type Organization

Types are organized to minimize circular dependencies:

```
shared-types/           # Pure types, no runtime dependencies
    ├── auth.ts         # Auth types (IRole, IPermission, UserDto)
    ├── tenant.types.ts # Tenant configuration types
    └── ...

platform-core/          # Re-exports from shared-types + runtime types
    └── types/
        ├── IRole.ts    # Re-exports from @cap/shared-types
        └── ...

module-admin/           # Imports shared-types, re-exports for convenience
    └── types/
```

**Rule:** If a type is used by multiple packages, it belongs in `shared-types`. If it's only used within one package, define it there.

## Plugin System

### Plugin Lifecycle

1. **Registration**: `registry.register(plugin)` - Plugin is added to registry
2. **Installing**: Dependencies are checked, install context is prepared
3. **Active**: Plugin outputs (components, routes, services) are registered
4. **Error**: If install fails, plugin is removed
5. **Uninstalled**: Outputs are cleaned up, plugin is removed

### Plugin Types

- **Component Plugin**: Provides React components
- **Route Plugin**: Provides route definitions
- **Service Plugin**: Provides singleton services
- **I18n Plugin**: Provides translation dictionaries
- **Hybrid Plugin**: Combines multiple plugin types

## Testing Strategy

Tests are organized alongside source files using the `.test.ts` suffix.

Critical paths that require test coverage:
1. Plugin registry lifecycle (install/uninstall)
2. usePermissions hook (role/permission checks)
3. Theme composition pipeline
4. Tenant type guards

## Known Gaps

1. **No tests in admin/platform-core/shared-types/theme packages** - Test infrastructure needs to be added
2. **Type leakage** - Some types defined in wrong packages
3. **Hook duplication** - Some hooks defined in multiple packages

See [TODO.md](./TODO.md) for tracking these issues.
