# Developer Onboarding & Workflow Guide

Welcome to the development team! This guide will walk you through setting up your local environment, the conventions for creating new modules, and the standards for routing, localization, and testing.

---

## 1. Local Setup & Environment

The project is structured as a monorepo utilizing **pnpm workspaces**. Ensure you have Node.js (v18+) and pnpm (v8+) installed before continuing.

### Initial Installation

Run the following command at the root of the repository to install dependencies and link workspace packages:
```bash
pnpm install
```

### Dev Scripts

*   **Start Local Dev Server**: Runs the Vite development server for the main application shell (`@cap/app`):
    ```bash
    pnpm run dev
    ```
*   **Build the Project**: Compiles all packages and bundles the host app for production:
    ```bash
    pnpm run build
    ```
*   **Run Linter**: Validates code quality across all packages:
    ```bash
    pnpm run lint
    ```

---

## 2. Module Development Conventions

All new features should be packaged as modules under `packages/modules/` to keep the host shell thin and maintainable.

### Step 1: Directory Structure

Create your module folder (e.g., `packages/modules/kyc`) matching the standard structure:
```
packages/modules/kyc/
├── package.json
├── src/
│   ├── index.ts                  # Export point for the CAPModule descriptor
│   ├── assets/                   # Images, SVGs, etc.
│   ├── components/               # Module-scoped components
│   ├── screens/                  # Page-level screens
│   ├── routes/
│   │   ├── routes.tsx            # Route configurations
│   │   └── path.ts               # Route path string constants
│   └── data/
│       └── dictionaries/         # Locales (en.json, fr.json, ar.json)
```

### Step 2: Configure `package.json`

Set up the package name and link the shared core dependencies:
```json
{
  "name": "@cap/module-kyc",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "dependencies": {
    "@cap/platform-core": "workspace:*",
    "@cap/shared-types": "workspace:*"
  }
}
```

### Step 3: Define Routes and Paths

1.  **`routes/path.ts`**: Declare path constants to avoid hardcoding routes:
    ```typescript
    export const KYCPath = {
      identityUpload: '/kyc/upload',
      status: '/kyc/status',
    } as const
    ```
2.  **`routes/routes.tsx`**: Define the route configuration:
    ```typescript
    import React from 'react'
    import { AuthRouteConfig } from '@cap/platform-core'
    import { KYCPath } from './path'
    import IdentityUpload from '../screens/IdentityUpload'
    import KYCStatus from '../screens/KYCStatus'

    export const kycRouteConfig: AuthRouteConfig[] = [
      { path: KYCPath.identityUpload, element: <IdentityUpload />, layout: 'vertical' },
      { path: KYCPath.status, element: <KYCStatus />, layout: 'vertical' }
    ]
    ```

### Step 4: Localizations (i18n)

Place translation files under `src/data/dictionaries/` (e.g. `en.json`):
```json
{
  "kyc": {
    "title": "Identity Verification",
    "upload_button": "Upload Document"
  }
}
```

Import and register them in your main module entry using `registerDictionary`:
```typescript
import { registerDictionary, getMergedDictionary } from '@cap/platform-core/i18n/registry'
import enKyc from './data/dictionaries/en.json'
import frKyc from './data/dictionaries/fr.json'
import arKyc from './data/dictionaries/ar.json'

registerDictionary({ en: enKyc, fr: frKyc, ar: arKyc })

export const en = getMergedDictionary('en')
export const fr = getMergedDictionary('fr')
export const ar = getMergedDictionary('ar')
```

### Step 5: Export the `CAPModule` Descriptor

In `packages/modules/kyc/src/index.ts`, export the module object implementing the `CAPModule` type:
```typescript
import type { CAPModule } from '@cap/shared-types'
import { kycRouteConfig } from './routes/routes'
import { en, fr, ar } from './i18n-setup' // Merged dictionaries

export const KYCModule: CAPModule = {
  id: 'kyc-module',
  version: '1.0.0',
  authRouteConfig: kycRouteConfig,
  i18n: { en, ar, fr },
  navItems: [
    {
      id: 'kyc-section',
      label: 'kyc.title',
      path: '/kyc/upload',
      icon: 'VerificationIcon'
    }
  ]
}
```

### Step 6: Register in Host Shell

To activate the module, open `app/src/AppAssembly.tsx`, import the descriptor, and add it to the `modules` list passed to `assembleApp`:
```typescript
import { KYCModule } from '@cap/module-kyc'

export const App = assembleApp({
  modules: [
    LandingModule,
    AuthModule,
    KYCModule, // Register new module here
  ]
})
```

---

## 3. Routing & Layout Conventions

To ensure screens are rendered with the correct navigation chrome, follow these guidelines:

### Standard vs Decorated Route Guards

1.  **Guest / Public Pages**: Pages that should render without chrome should be tagged with `layout: 'noLayout'`.
2.  **Decorated Routes**:
    *   **Authenticated Routes**: Wrap your screen component using `createAuthRoute` to automatically handle authentication checks, email verification gates, and layout overrides.
    *   **Admin Routes**: Wrap your screen component using `createAdminRoute` to enforce RBAC gates and layout overrides.
    ```typescript
    import { createAuthRoute } from '@cap/module-auth'

    // The decorator handles session guards and layouts automatically
    export const DashboardScreen = createAuthRoute(() => <Dashboard />, {
      layout: 'vertical',
      requiresVerification: true
    })
    ```

---

## 4. Verification, Standards & Quality Assurance

We maintain code quality using static analysis and automated test suites.

### Testing Tools

*   **Unit Tests (Vitest)**: Used for service logic, hooks, and utilities:
    ```bash
    pnpm run test
    ```
*   **E2E Tests (Playwright)**: Used to verify user journeys (e.g. login flows):
    ```bash
    pnpm run test:e2e
    ```

### Git Workflow & Commit Hooks

We use **Husky** to lint files before committing:
1.  On staging files (`git add`), a pre-commit hook runs `lint-staged`.
2.  This triggers `eslint` (code style checks), `cspell` (spell check), and checks formatting via `prettier`.
3.  Commit messages are validated against conventional commit guidelines. Ensure your commits follow the pattern: `feat(auth): add passkey support` or `fix(table): fix scroll offset`.

### Structural Quality Rules

*   **Barrel File Enforcement (`index.ts`)**: Every UI folder and package must export its interface elements via a central `index.ts` file (e.g., `/packages/layout/src/components/ui/index.ts`). Deep subdirectory imports (e.g., `import X from '@cap/layout/src/components/ui/virtualized/VirtualizedTable'`) are prohibited. Consumers must import via the barrel root:
    ```typescript
    import { VirtualizedTable } from '@cap/layout'
    ```
*   **Consolidated Configurations**: To prevent rule drift, ESLint, Prettier, and TypeScript configurations are anchored at the monorepo root. Use project reference inheritance in sub-project configs rather than declaring stand-alone configuration rules.

