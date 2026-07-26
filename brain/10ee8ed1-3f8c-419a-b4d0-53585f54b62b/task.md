# Task List: Dynamic Module Federation

- [x] Update `CAPModule` in `packages/shared-types/src/module.ts` (add `routes`, `storeReducers`).
- [x] Create `IModuleContract` alias in `packages/api-contracts/src/types/module-contract.ts`.
- [x] Update `packages/platform-core/src/assembly/index.tsx` to read `module.routes`.
- [x] Update `packages/modules/auth/src/index.ts` (rename `authRouteConfig` to `routes`, move `initAuthPlugins`).
- [x] Update `packages/modules/landing/src/index.ts` (rename `authRouteConfig` to `routes`).
- [x] Update `app/src/AppAssembly.tsx` to use Vite `import.meta.glob` for auto-discovery.
- [x] Setup Plop.js factory (add to `package.json`, create `plopfile.mjs`, create templates).
- [x] Run automated checks (`npm run build:check`, `npm run lint`).
