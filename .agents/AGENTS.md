# AGENTS.md — CAP Framework Developer & AI Agent Context

This document provides complete architectural context, coding standards, theme strategies, framework principles, and development workflows for AI coding agents and engineering contributors working on the **CAP Multi-Tenant SaaS Framework**.

---

## 1. Framework Identity & Monorepo Architecture Overview

The workspace is a multi-tenant, modular web framework built with React 19, TypeScript, Material UI (MUI v7), Zustand, and Vite, managed via `pnpm` workspaces.

### Package Inventory & Layer Hierarchy

```
Tier 5: Shell App             [@cap/app]
                                  │
Tier 4: Feature Modules       [@cap/module-auth, @cap/module-landing]
                                  │
Tier 3: Platform Façade       [@cap/platform-core]
                                  │
Tier 2: Platform Services     [@cap/layout, @cap/auth-contracts]
                                  │
Tier 1: Core Domain           [@cap/platform-store, @cap/theme, @cap/api-contracts]
                                  │
Tier 0: Foundation            [@cap/shared-types]
```

#### Package Responsibilities

* **`@cap/shared-types`** (`packages/shared-types`): Zero-dependency TypeScript type declarations, domain entities, API contracts (`CAPModule`, `TenantThemeConfig`, `AccessPolicy`, `SearchItemConfig`).
* **`@cap/api-contracts`** (`packages/api-contracts`): API query key factories, request/response models, and endpoint schema declarations.
* **`@cap/platform-store`** (`packages/platform-store`): Main Zustand global state management (`useAppStore`) with encrypted persistent storage (`secureStorage`), sliced by domain.
* **`@cap/theme`** (`packages/theme`): MUI v7 design tokens, token composition (`composeMuiTheme`), tenant theme context (`TenantThemeProvider`), visual effects (glassmorphism, neumorphism, bento, brutalism, organic, immersive), component overrides, baseline styles, and default `themeConfig`.
* **`@cap/auth-contracts`** (`packages/auth-contracts`): Contracts and administrative services specific to identity and access management.
* **`@cap/layout`** (`packages/layout`): Structural layout components (`VerticalLayout`, `HorizontalLayout`, `PublicLayout`, `BlankLayout`), navigation shells, `ThemeBridge`, `ModuleMenuRenderer`, and `SkipToContent`.
* **`@cap/platform-core`** (`packages/platform-core`): Central orchestration façade for runtime module assembly (`assembleApp`), routing, i18n initialization, plugin registry (`globalPluginRegistry`), `TenantProvider`, and `LayoutRouteWrapper`.
* **`@cap/module-auth`** (`packages/modules/auth`): Complete IDaaS module encompassing auth-core, MFA, passwordless, SAML, JWKS, identity broker, user directory, and session management.
* **`@cap/module-landing`** (`packages/modules/landing`): Public marketing pages, workflow step pipeline, pricing tables, contact forms, and legal screens.
* **`@cap/app`** (`app`): Shell application entry point (`main.tsx`), provider assembly (`Providers.tsx`), top-level layout selector (`layout.tsx`), Vite config, and Playwright e2e tests.

---

## 2. Module Assembly & Dynamic Plugin System

### The `CAPModule` Interface
Every feature module exports a `CAPModule` contract object containing:
- `id`: Unique module identifier string (e.g. `'auth-module'`, `'landing-module'`)
- `version`: SemVer string (e.g. `'1.0.0'`)
- `routes`: Array of route configurations (`ModuleRouteConfig[]`) with layout intent
- `navItems`: Navigation items (`NavItemConfig[]`) specifying ordering, section groupings, icons, role guards, and layout variants
- `searchItems`: Command-palette search entries (`SearchItemConfig[]`)
- `i18n`: Localized dictionary bundles (`en`, `fr`, `ar`)
- `plugins`: Module-level plugins conforming to `CAPPlugin`

### Runtime Module Discovery
`AppAssembly.tsx` resolves modules through a dual mechanism:
1. **Static Discovery**: Vite `import.meta.glob` scans `../../packages/modules/*/src/index.ts` eagerly.
2. **Dynamic Registration**: `registerDynamicModule(contract)` allows uploaded or remote modules to register at runtime.
3. **Assembly Memoization**: The assembled router component is memoized via `React.useMemo()` in `AppAssembly.tsx` to preserve React DOM stability across renders.

---

## 3. Theme & Design System Strategy

### Three-Layer Theme Compilation
1. **Tokens (`PrimitiveTokens`)**: Color palettes (primary, secondary, background, paper, status colors), spacing scales, radii, typography rules, shadows, and z-index definitions.
2. **Composition (`composeMuiTheme`)**: Merges primitive tenant tokens with dark/light mode bases and applies MUI component overrides (`getComponentOverrides`).
3. **Delivery (`ThemeBridge` & `DesignSystemProvider`)**: Synchronizes tenant configuration with CSS custom properties (`--border-color`, `--header-z-index`) via `applyThemeVariablesSync` and provides the compiled MUI `theme` via `MuiThemeProvider`.

### System Mode & RTL Support
- When `settings.mode === 'system'`, theme mode dynamically resolves browser `prefers-color-scheme`.
- Components MUST use RTL-aware logical CSS properties (`inlineSize`, `blockSize`, `marginInlineStart`).

---

## 4. Coding Standards & Engineering Rules

### Framework Principles
* **Zero Hardcoded Menus**: Never hardcode route lists or menu items in layout components; declare them inside module contracts via `navItems` and `routes`.
* **Code Splitting Required**: Always wrap screen components in `React.lazy()` when declaring `ModuleRouteConfig[]`.
* **No render-phase factory calls**: Component definitions or router tree assemblies (`assembleApp`) MUST NOT be called inline inside render bodies without `useMemo`.
* **Typing**: Avoid `any`. Use strict TypeScript interfaces exported from `@cap/shared-types` or package `types/`.
* **State Scoping**: Keep transient component state in `useState`/`useReducer`. Only system-wide or cross-module state belongs in `@cap/platform-store` (Zustand).

### Security & Privacy
* **Zero PII Logging**: NEVER log sensitive credentials, authorization tokens, or raw user storage payload objects (`state.user`) to the console.
* **Environment Guards**: Wrap diagnostic logging in `if (import.meta.env.DEV)`.
* **Production Logs**: Keep `console.error` and `console.warn` intact in production for exception tracking.

---

## 5. Key Documentation Index

| Document | File Path | Description |
|---|---|---|
| **Architecture Reference** | [`ARCHITECTURE.md`](file:///c:/Node.Js/proj/boilerplate/ARCHITECTURE.md) | Full multi-tenant framework architecture, layer rules, and provider hierarchy. |
| **Module Development Guide** | [`MODULE_DEVELOPMENT_GUIDE.md`](file:///c:/Node.Js/proj/boilerplate/MODULE_DEVELOPMENT_GUIDE.md) | Step-by-step guide for creating modules, route declarations, navigation items, and plugins. |
| **Theme System Guide** | [`packages/theme/THEME_SYSTEM.md`](file:///c:/Node.Js/proj/boilerplate/packages/theme/THEME_SYSTEM.md) | Design token pipeline, theme presets, and visual effect generators. |
| **Design System Standards** | [`packages/theme/DESIGN_SYSTEM.md`](file:///c:/Node.Js/proj/boilerplate/packages/theme/DESIGN_SYSTEM.md) | MUI component styling rules, typography standards, and accessibility requirements. |
| **Contributing Guide** | [`CONTRIBUTING.md`](file:///c:/Node.Js/proj/boilerplate/CONTRIBUTING.md) | Environment setup, CLI commands, and PR guidelines. |
