# Component Deep Dive — Module Assembly (`@cap/platform-core/assembly`)

File: `packages/platform-core/src/assembly/index.tsx`

## What It Does
`assembleApp({ modules })` is called once in `app/src/AppAssembly.tsx` with the active module list. On each call it:
1. Resets two module-level (non-React) registries: `_modules` and `_searchItems`.
2. Clears navigation in the Zustand store (`useAppStore.getState().clearNavigation()`).
3. For each module, in array order:
   - Registers `module.i18n` bundles into i18next strictly isolated by module namespace (`moduleNs = module.id || module.name || 'common'`). This eliminates global translation key collisions across modules.
   - Registers `module.navItems` into the store.
   - Appends `module.searchItems`, deduped by `item.id` (first occurrence wins).
4. Flattens `module.authRouteConfig` from every module into one array, deduped by `path` (first occurrence wins).
5. Returns a functional `App` component rendering a single `<Routes>` tree where each route is wrapped in `<LayoutRouteWrapper element={element} layout={layout} />`, plus a catch-all wildcard `<Route path='*' element={<LayoutRouteWrapper element={<NotFound />} />} />`.

## Notable Implementation Details
- **Module-level mutable arrays (`_modules`, `_searchItems`) instead of React state/context.** This works because `assembleApp` is called once at module-evaluation time in practice, but it means these registries are shared, non-reactive, global mutable state.
- **Isolated i18n namespaces**: i18n resources are registered under module-scoped namespaces to ensure module translation keys do not overwrite each other.
- **Layout metadata preservation**: `assembleApp` passes the `layout` metadata to `LayoutRouteWrapper`, ensuring non-default layout overrides like `noLayout` or `admin` are properly synced to the layout state.
- **Dedicated Catch-All 404 Route**: Unmatched paths trigger the `<NotFound />` component wrapped in `LayoutRouteWrapper`, avoiding blank null screens.

## Consumers
- `app/src/AppAssembly.tsx` — the primary application invocation.
- `getNavItems()`, `getSearchItems()`, `getModules()` are exported for other parts of the app to read the merged registries.
