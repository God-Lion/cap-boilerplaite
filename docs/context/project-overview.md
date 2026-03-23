# CAP Boilerplate — Context Overview

> **AI Quick Start**: Read this file first. It tells you what the project is, how it's structured,
> and where to find detailed context for any specific area.

## Quick Navigation for AI

| Your Task | Go To |
|---|---|
| Understanding the auth system | `components/auth-module.md` |
| Working on platform-core services | `components/platform-core.md` |
| Theming / UI customization | `components/theme-system.md` |
| Layout / navigation shell | `components/layout-package.md` |
| Adding a new feature module | `architecture/decisions/adr-002-module-pattern.md` |
| Architectural reasoning | `architecture/system-design.md` |
| Dev workflow / tooling | `workflows/development.md` |

---

## Project Essentials

- **Purpose**: Full-stack authentication and identity management frontend boilerplate — a React/TypeScript
  monorepo providing plug-in auth screens, RBAC, SSO/SAML/OIDC, MFA, passkeys, session management,
  user profiles, and an admin dashboard. Designed to be composed per tenant/product.
- **Tech Stack**: React 18+, TypeScript 5, Vite, MUI (Material UI v5+), TanStack Query v5,
  Zustand, React Router v6, React Hook Form + Zod, i18next (AR/EN/FR), Playwright (E2E), Vitest (unit)
- **Architecture**: pnpm monorepo — workspace packages under `@cap/*` scope
- **Package Manager**: pnpm with `pnpm-workspace.yaml` at root
- **Scope Prefix**: All internal packages use `@cap/` (e.g., `@cap/platform-core`, `@cap/module-auth`)

---

## Monorepo Structure at a Glance

```
boilerplate/
├── app/                        # Host shell — assembles all @cap/* modules into a runnable app
│   └── src/
│       ├── AppAssembly.tsx     # Root module wiring
│       ├── Providers.tsx       # Global providers (theme, query, i18n, router)
│       ├── Modules/            # App-level route module: ERR0R (404/401)
│       ├── menu/               # Full horizontal + vertical nav system (being migrated to @cap/layout)
│       ├── components/         # App-local shared components (dialogs, table, virtualized)
│       ├── core/               # Core hooks, styles, custom-inputs
│       ├── theme/              # MUI theme wiring
│       └── utils/              # Utilities (Filters, Functions, getRole, rgbaToHex, zone, etc.)
│
└── packages/
    ├── platform-core/          # @cap/platform-core — shared services, state, theme engine
    ├── shared-types/           # @cap/shared-types — cross-package TypeScript types
    ├── layout/                 # @cap/layout — UI shell (layouts, nav components)
    ├── theme/                  # @cap/theme — tenant theme tokens, styled components
    └── modules/
        ├── auth/               # @cap/module-auth — PRIMARY: full auth system (8 sub-modules)
        ├── admin/              # @cap/module-admin — admin dashboard + theme customizer
        ├── landing/            # @cap/module-landing — public marketing pages
        └── theme-admin/        # @cap/theme-admin — visual theme editor UI
```

---

## Key Packages — One-Line Descriptions

| Package | Role |
|---|---|
| `@cap/platform-core` | API client, auth service, Zustand store slices, MUI theme overrides, encryption, storage utils |
| `@cap/module-auth` | All authentication screens + logic: sign-in/up, MFA, passkeys, SSO, RBAC, sessions, users |
| `@cap/layout` | Layout shells (Vertical/Horizontal/Blank/Public), nav menus, header/footer components |
| `@cap/theme` | Tenant theme context, design tokens, glass/neumorphic styled components |
| `@cap/shared-types` | Shared TypeScript interfaces: `IAuth`, `IUser`, `ICommon` — compiled to `dist/` |
| `@cap/module-admin` | Admin overview dashboard, theme customizer |
| `@cap/module-landing` | Public landing pages: Hero, Pricing, FAQ, About, Contact |
| `@cap/theme-admin` | Color palette editor, component style selector, live preview |

---

## AI Collaboration Notes

### Coding Standards & Patterns
- **TypeScript strict mode** — all packages use strict tsconfig; avoid `any`, use generics
- **Component pattern**: Functional components only, React hooks, no class components
- **Form pattern**: React Hook Form + Zod schema validation (see `authentication-core/utils/schema.ts`)
- **Data fetching**: TanStack Query (`useQuery`/`useMutation`) wrapped in custom hooks per module
- **State**: Zustand slices in `platform-core/src/store/slices/` — do NOT add local state when a slice exists
- **Routing**: React Router v6 with file-per-route in each module's `routes/routes.tsx`
- **i18n**: All user-facing strings through `i18next`; dictionaries in each module's `src/data/dictionaries/`
- **Styling**: MUI `sx` prop or `styled()` — no raw CSS except in `.module.css` files; no inline styles
- **Auth checks**: Use `AuthRoute` / `GuestRoute` / `AdminRoute` middlewares from the auth module

### Constraints & Important Rules
- **Never add business logic to `app/`** — business logic belongs in the relevant `packages/modules/*` package
- **Never import between sibling modules** — e.g., `module-auth` must not import from `module-admin`
- **`platform-core` is the shared foundation** — all modules may import from it; it imports from no module
- **`shared-types` has no runtime deps** — it compiles to plain TS types only
- **pnpm workspace hoisting**: Some packages have their own `node_modules/` due to version conflicts (e.g., `session-manager` has `@mui/lab`)
- **E2E tests in `app/e2e/`** require `playwright.config.ts` and auth state from `playwright/.auth/user.json`

### Common Patterns to Follow
- New auth screens → add to appropriate sub-module under `packages/modules/auth/src/modules/`
- New routes → register in that sub-module's `routes/routes.tsx` AND `src/routes/routes.tsx` (top-level aggregator)
- New types → add to `@cap/shared-types/src/` if cross-package, or module's `types/` if local
- New API endpoints → define in `services/endpoints.ts`, service methods in `services/*.service.ts`
- New store state → add slice to `platform-core/src/store/slices/`
