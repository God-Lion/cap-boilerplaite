# Contributing to CAP Monorepo

Welcome to the CAP Monorepo! This document provides guidelines for environment setup, package commands, module scaffolding, and pull request rules.

---

## 1. Development Setup

### Prerequisites
- Node.js >= 20.x
- `pnpm` >= 9.x (`npm i -g pnpm`)

### Installation & Server Execution
```bash
# Install workspace dependencies
pnpm install

# Start local dev server (@cap/app)
pnpm dev

# Or filter explicitly
pnpm --filter @cap/app run dev
```

---

## 2. Monorepo Layer Rules

When adding code or creating packages, respect the **6-Tier Architecture**:

1. **Tier 0 (`@cap/shared-types`)**: Pure TypeScript types ONLY. No runtime logic or heavy imports.
2. **Tier 1 (`@cap/platform-store`, `@cap/theme`, `@cap/api-contracts`)**: Core domain logic, state management, and design system tokens.
3. **Tier 2 (`@cap/layout`, `@cap/auth-contracts`)**: Structural layout components and service contracts. May depend on Tier 0 and Tier 1 ONLY.
4. **Tier 3 (`@cap/platform-core`)**: Assembly orchestration, dynamic router, tenant service, plugin registry.
5. **Tier 4 (`@cap/modules/*`)**: Feature modules. Export a `CAPModule` contract.
6. **Tier 5 (`@cap/app`)**: Shell app container.

---

## 3. Scaffolding New Feature Modules

To generate a new feature module conforming to monorepo architecture:
```bash
pnpm generate:module
```
This runs the workspace Plop generator, creating standard module scaffolding under `packages/modules/<module-name>/`.

---

## 4. Quality Commands

```bash
# Type check all packages
pnpm -r run type-check

# Lint monorepo
pnpm -r run lint

# Build all packages
pnpm -r run build
```

---

## 5. Security & Privacy Rules

- **No PII Logging**: Do NOT log user credentials, tokens, or personal user objects (`user`) to the console.
- **Environment Guards**: Wrap diagnostic logging in `if (import.meta.env.DEV)`.
- **RTL Support**: Always use logical CSS properties (`inlineSize`, `marginInlineStart`) for layout components.
