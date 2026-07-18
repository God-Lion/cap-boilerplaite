# TrustKey Monorepo

Welcome to **TrustKey**, a premium, multi-tenant decentralized identity and digital services platform. Built with a highly modular, decoupled architecture, this workspace leverages React 19, Material UI (MUI) v7, React Router v7, and `pnpm` workspaces for local development.

---

## 🏛️ Architecture & Folder Structure

This project is organized as a monorepo containing a host application, shared platform utilities, and distinct domain modules:

### 📱 Host Application
* **[`app/`](file:///c:/Node.Js/proj/boilerplate/app)**: The entry point (Vite-based application) that orchestrates and serves all dynamic modules and platform settings.

### 🛡️ Shared Platform Packages (`packages/`)
* **[`packages/platform-core`](file:///c:/Node.Js/proj/boilerplate/packages/platform-core)**: Core utilities, hooks (e.g., `useSessionGuard`, `useModuleComponent`), and shared business logic.
* **[`packages/platform-store`](file:///c:/Node.Js/proj/boilerplate/packages/platform-store)**: Application state management including hydration, secure storage, optimistic updates, and Redux/Zustand slices.
* **[`packages/platform-ui`](file:///c:/Node.Js/proj/boilerplate/packages/platform-ui)**: Reusable UI component library, wrappers, and types.
* **[`packages/shared-types`](file:///c:/Node.Js/proj/boilerplate/packages/shared-types)**: Shared type definitions, constants, and API schemas.
* **[`packages/theme`](file:///c:/Node.Js/proj/boilerplate/packages/theme)**: Global styles, design tokens, and Material UI configurations.
* **[`packages/layout`](file:///c:/Node.Js/proj/boilerplate/packages/layout)**: App shell, sidebar, and layout templates.

### 🧩 Domain Modules (`packages/modules/`)
Each module encapsulates a specific vertical feature set with clean isolation boundaries:
* **[`packages/modules/auth`](file:///c:/Node.Js/proj/boilerplate/packages/modules/auth)**: Multi-Factor Authentication (MFA), login/register flows, and Identity Broker integration.
* **[`packages/modules/document-processing`](file:///c:/Node.Js/proj/boilerplate/packages/modules/document-processing)**: Processes OCR and verifies official documents.
* **[`packages/modules/landing`](file:///c:/Node.Js/proj/boilerplate/packages/modules/landing)**: Public landing and informational pages.

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: `18.x` or higher
- **pnpm**: `8.x` or higher (package manager)

### 1. Setup Local Tenants
TrustKey is a multi-tenant platform. Run the setup script to update your local `/etc/hosts` file (requires Administrator/root privileges):
```bash
node scripts/setup-tenants.js
```
This adds the following local domains:
* `tenant1.localhost`
* `tenant2.localhost`
* `tenant3.localhost`

### 2. Install Dependencies
Initialize and link all workspaces in the monorepo:
```bash
pnpm install
```

### 3. Run Development Server
Start the Vite development server:
```bash
pnpm dev
```
Open your browser and navigate to `http://tenant1.localhost:5173`.

---

## 🛠️ Workspace Commands

Manage the monorepo using commands from the root directory:

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts the Vite dev server for the host application (`@cap/app`). |
| `pnpm build` | Builds all packages and compile assets for production. |
| `pnpm lint` | Runs ESLint analysis across all project packages. |
| `pnpm test:e2e` | Runs Playwright end-to-end integration tests. |
| `node scripts/analyze-coupling.cjs` | Analyzes module coupling and checks for architectural boundary violations. |
| `node scripts/i18n-sync.js` | Synchronizes translation keys across locale dictionaries. |
| `node scripts/i18n-lint.js` | Audits translation keys and checks for missing entries. |

---

## ⚙️ Development Guidelines

1. **Strict Coupling Isolation**: Do not import modules directly from one another. Use `@cap/platform-core` or dependency injection to coordinate actions between modules. Use the `scripts/analyze-coupling.cjs` script to verify your changes.
2. **Translation Key Integrity**: Keep translations in sync across English, French, and Arabic. Run `node scripts/i18n-sync.js` after introducing new keys.
3. **Commit Hooks**: Pre-commit linting and type checking are configured via Husky to ensure high code quality.
