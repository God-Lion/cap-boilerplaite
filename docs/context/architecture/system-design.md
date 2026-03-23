# System Architecture — CAP Boilerplate

## Architecture Pattern: Feature-Module Monorepo

The project uses a **pnpm monorepo** organized around self-contained feature modules,
assembled by a thin host shell (`app/`). Everything is statically bundled by Vite at build time
(not runtime module federation).

---

## Dependency Graph

```
app/ (host shell)
 ├──→ @cap/platform-core
 ├──→ @cap/layout
 ├──→ @cap/module-auth
 ├──→ @cap/module-admin
 ├──→ @cap/module-landing
 └──→ @cap/theme

@cap/module-auth      ──→ @cap/platform-core, @cap/shared-types
@cap/module-admin     ──→ @cap/platform-core, @cap/module-auth, @cap/theme
@cap/layout           ──→ @cap/platform-core
@cap/theme            ──→ @cap/platform-core, @cap/shared-types
@cap/platform-core    ──→ @cap/shared-types (types only)
@cap/shared-types     ──→ (no runtime deps)
```

**Rules**: No circular dependencies. No sibling module imports (auth ↔ admin forbidden).
`platform-core` is the foundation — it imports from no module.

---

## Internal Module Layer Pattern

Each `@cap/module-*` follows this consistent internal structure:

```
module/
├── src/index.ts              # Public API — only export through here
├── routes/routes.tsx         # React Router v6 route definitions
├── registry/                 # Module registry / plugin registration
├── plugins/                  # Optional plugins (e.g., MFATOTPPlugin.tsx)
├── domain-kernel/src/        # Pure domain logic (no React, no HTTP)
├── idaas-facade/src/         # Anti-corruption layer to IDaaS backend API
└── modules/[feature]/
    ├── index.ts              # Sub-module public API
    ├── components/           # Presentational + container components
    ├── hooks/                # Custom hooks (TanStack Query wrappers)
    ├── middlewares/          # Route guards (AuthRoute, GuestRoute, AdminRoute)
    ├── screens/              # Full-page screen components
    ├── services/             # HTTP service layer (axios / fetch)
    ├── store/                # Zustand state (if local to sub-module)
    ├── types/                # TypeScript interfaces local to sub-module
    └── utils/                # Pure utility functions
```

---

## Auth Module Sub-Module Map

The `@cap/module-auth` package is itself composed of 8 specialized sub-modules:

| Sub-Module | Responsibility |
|---|---|
| `authentication-core` | Sign-in, sign-up, password reset, email verification, device code |
| `authorization-engine` | RBAC roles, permissions, API token management |
| `developer-console` | Developer API keys screen |
| `identity-broker` | SSO (OIDC, SAML), SCIM provisioning, directory sync |
| `mfa-orchestrator` | TOTP, passkeys (WebAuthn), MFA verification |
| `passwordless-service` | Magic link / passwordless initiation + verification |
| `platform-cluster` | Admin monitoring: audit logs, auth events, health, email testing |
| `session-manager` | Active session management, session guard middleware |
| `user-directory` | User profiles, organizations, NFC access, account settings |

---

## Data Flow Pattern

```
Screen (React component)
  └─→ Custom Hook (useXxxQuery.ts / useXxxMutation.ts)
        └─→ TanStack Query (useQuery / useMutation)
              └─→ Service function (xxx.service.ts)
                    └─→ API client (platform-core/services/api/api.client.ts)
                          └─→ Backend HTTP API
```

State that lives in TanStack Query cache: server data (users, sessions, tokens, etc.)
State that lives in Zustand: auth session, theme, settings, navigation, offline queue

---

## Build & Tooling

- **Bundler**: Vite (vite.config.ts per package)
- **Type checking**: TypeScript (tsconfig.app.json, tsconfig.node.json per package)
- **Linting**: ESLint with `eslint.config.js` (flat config) per package
- **Formatting**: Prettier with `.prettierrc` per package
- **Unit tests**: Vitest (`vitest.config.ts`) — tests co-located as `*.test.ts`
- **E2E tests**: Playwright (`playwright.config.ts` in `app/`) — specs in `app/e2e/`
- **Git hooks**: Husky + lint-staged (root `.husky/`)
- **Branch validation**: `validate-branch-name`
- **PWA**: `vite-plugin-pwa` (service worker in `app/`)
- **Performance**: Lighthouse CI (`.lighthouserc.json` in `app/`)
