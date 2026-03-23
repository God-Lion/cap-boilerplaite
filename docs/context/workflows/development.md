# Development Workflow

## Getting Started

### Prerequisites
- Node.js (check `check_versions.js` at repo root for required version)
- pnpm (`npm install -g pnpm`)

### Install & Run
```bash
# Install all workspace dependencies
pnpm install

# Start the host app (development)
cd app && pnpm dev        # Vite dev server

# Or from root (if root script exists):
pnpm dev
```

---

## Project Scripts (per package)

Each package (`app/`, `packages/*/`) has its own `package.json` scripts:

| Command | Purpose |
|---|---|
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:coverage` | Run tests with V8 coverage report |
| `pnpm lint` | ESLint (flat config) |
| `pnpm lint:fix` | ESLint with auto-fix |
| `pnpm format` | Prettier format |
| `pnpm typecheck` | TypeScript type-check (no emit) |

---

## Testing Strategy

### Unit Tests (Vitest)
- **Location**: Co-located with source — `*.test.ts` / `*.test.tsx` next to the file under test
- **Alt location**: `__tests__/` subdirectory (used in `app/src/utils/` and `core/hooks/`)
- **Config**: `vitest.config.ts` at each package root
- **Coverage**: `@vitest/coverage-v8`
- **Key tested areas**: Route guards (`AuthRoute`, `GuestRoute`, `AdminRoute`), hooks
  (`useAuthQuery`, `useSignOut`, `usePasskey`, `useOidcCompliance`, `useSessionGuard`),
  store, utilities (schema validation, normalizeAuthUser, Filters, Functions, rgbaToHex)
- **Test setup**: `src/test-setup.ts` (jsdom environment, @testing-library/jest-dom matchers)

### E2E Tests (Playwright)
- **Location**: `app/e2e/` — spec files (`*.spec.ts`)
- **Config**: `app/playwright.config.ts`
- **Auth state**: `app/playwright/.auth/user.json` (populated by `auth.setup.ts`)
- **Coverage areas**: signin, signup, session, MFA, passkey, password-reset, email-verification
- **Shared config**: `app/e2e/test-config.ts`

---

## Code Quality Gates

### Git Hooks (Husky + lint-staged)
Configured at repo root in `.husky/`. Runs on every commit:
- **pre-commit**: lint-staged → ESLint + Prettier on staged files
- **Branch naming**: `validate-branch-name` enforces branch naming convention

### TypeScript
- Each package has `tsconfig.json` + `tsconfig.app.json` (app-specific)
- **Enhanced config**: `app/tsconfig.app.enhanced.json` — stricter rules for CI
- Run `pnpm typecheck` before PRs to catch cross-package type errors

### Linting
- **Flat config** (`eslint.config.js`) used across all packages
- Enhanced config: `app/eslint.config.enhanced.js` for stricter CI checks
- Key plugins: `react`, `react-hooks`, `react-compiler`, `react-refresh`, `prettier`

---

## Adding New Features — Decision Tree

### New Auth Screen?
1. Identify the correct sub-module (`authentication-core`, `mfa-orchestrator`, etc.)
2. Create screen in `screens/[category]/MyScreen.tsx`
3. Add Zod schema in `utils/schema.ts` (if form)
4. Create service method in `services/`
5. Create TanStack Query hook in `hooks/`
6. Register route in sub-module `routes/routes.tsx`
7. Register route in `src/routes/routes.tsx` (top-level aggregator)
8. Export from sub-module `index.ts` if needed externally
9. Add i18n keys to `src/data/dictionaries/{en,ar,fr}.json`

### New API Endpoint?
1. Add endpoint constant to `services/endpoints.ts`
2. Add service method to `services/*.service.ts`
3. Create or update TanStack Query hook in `hooks/`
4. Define request/response types in `types/api.types.ts`

### New Zustand State?
1. Only add to `platform-core/src/store/slices/` (shared) or module's `store/` (local)
2. Follow existing slice pattern: state + actions + selectors in one file
3. Export selector hooks for type-safe access

---

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase `.tsx` | `LoginScreen.tsx` |
| Hooks | camelCase, `use` prefix | `useAuthQuery.ts` |
| Services | camelCase, `.service.ts` suffix | `auth.service.ts` |
| Types/interfaces | PascalCase, `I` prefix for interfaces | `IAuth.ts`, `auth.types.ts` |
| Store slices | camelCase, `Slice` suffix | `authSlice.ts` |
| Utilities | camelCase | `normalizeAuthUser.ts` |
| Tests | same name + `.test.ts/tsx` | `useAuthQuery.test.ts` |
| i18n dictionaries | ISO 639-1 code | `en.json`, `ar.json`, `fr.json` |
| Route files | `routes.tsx` (fixed name) | `routes/routes.tsx` |
| Index re-exports | `index.ts` (fixed name) | `hooks/index.ts` |

---

## Performance Tooling

- **Lighthouse CI**: `app/.lighthouserc.json` — run after build to check Web Vitals
- **PWA**: `vite-plugin-pwa` generates service worker; `dev-dist/` for dev preview
- **Bundle analysis**: Vite's built-in `--report` flag or `rollup-plugin-visualizer`
- **Vitest browser mode**: `@vitest/browser-playwright` available for component tests in browser

---

## Environment & Configuration

- **Environment vars**: `.env` at `app/` root (Vite `import.meta.env.VITE_*`)
- **Tenant config**: Fetched at runtime via `tenantService.ts` in `platform-core`
- **Multi-tenant setup**: See `scripts/setup-tenants.js` at repo root
- **Workspace config**: `workspace.json` at root (custom workspace metadata)
- **VS Code**: `.vscode/` in `app/` and `modules/auth/` with recommended settings
