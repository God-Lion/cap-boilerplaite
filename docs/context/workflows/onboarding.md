# Onboarding Guide

## Quick Start (new developer)
1. Clone repository:
   ```bash
   git clone <repo-url> c:\Node.Js\proj\boilerplate
   cd c:\Node.Js\proj\boilerplate
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run development server:
   ```bash
   cd app
   pnpm dev
   ```
4. Open browser at `http://localhost:5173` (default Vite port)

## Verify Setup
- Run `pnpm lint` from root
- Run `pnpm test` from any package using `pnpm --filter <pkg> test`
- Run E2E:
  ```bash
  cd app
  pnpm test:e2e
  ```

## Add Your First Screen (Auth Module Example)
1. Pick sub-module under `packages/modules/auth/src/modules/<sub-module>/screens`.
2. Add component `MyNewScreen.tsx`:
   - Functional component
   - Use `useTranslation()` for strings
   - If form, use React Hook Form + Zod.
3. Add route in sub-module `routes/routes.tsx` and top-level `packages/modules/auth/src/routes/routes.tsx`.
4. Add i18n keys to sub-module dictionaries:
   - `packages/modules/auth/src/data/dictionaries/en.json` (and `ar.json`, `fr.json`)
5. Add unit test under same folder: `MyNewScreen.test.tsx`.
6. Run `pnpm --filter @cap/module-auth test`.

## Project Workflow
- Feature branches: `feature/<ticket-id>-brief-description`
- peer review PR with tests and lint passing
- `pnpm typecheck` and `pnpm lint` required for merge

## Dev Tools
- VSCode: open root workspace `boilerplate.code-workspace`
- Use `F1` -> `Debugger: Start` for app and tests
- Use `npm run format` or `pnpm prettier --write .` to format

## Contribution Notes
- Avoid direct cross-module imports between leaf modules (e.g., auth ↔ admin)
- Add new shared types to `@cap/shared-types`
- Add module-specific docs under `docs/context/components/` as needed
