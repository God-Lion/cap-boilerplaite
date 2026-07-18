# Component Deep Dive — Module Assembly (`@cap/platform-core/assembly`)

File: `packages/platform-core/src/assembly/index.tsx`

## What It Does
`assembleApp({ modules })` is called once in `app/src/AppAssembly.tsx` with the active module list. On each call it:
1. Resets two module-level (non-React) registries: `_modules` and `_searchItems`.
2. Clears navigation in the Zustand store (`useAppStore.getState().clearNavigation()`).
3. For each module, in array order:
   - Registers `module.i18n` bundles into i18next under both the `translation` and `common` namespaces (per language), with `overwrite=true` — **later modules in the array silently overwrite earlier modules' keys** for identical keys within the same namespace.
   - Registers `module.navItems` into the store.
   - Appends `module.searchItems`, deduped by `item.id` (first occurrence wins).
4. Flattens `module.authRouteConfig` from every module into one array, deduped by `path` (first occurrence wins — opposite precedence direction from i18n above).
5. Returns a functional `App` component rendering a single `<Routes>` tree: `{path, element}` pairs plus a catch-all `<Route path='*' element={null}/>`.

## Notable Implementation Details
- **Module-level mutable arrays (`_modules`, `_searchItems`) instead of React state/context.** This works because `assembleApp` is called once at module-evaluation time in practice, but it means these registries are shared, non-reactive, global mutable state — `getModules()`/`getSearchItems()` reads are not tied to React's render cycle. Safe today given single invocation, but fragile if `assembleApp` were ever called more than once (e.g. dynamically re-assembling for a different tenant/config) since the comment says "useful for HMR or multiple assemblies" yet nothing invalidates stale closures elsewhere that may have captured earlier registry contents.
- **Inconsistent precedence rules**: i18n bundles use last-write-wins; search items and routes use first-write-wins. Not wrong, but undocumented and easy to get backwards when adding a new module.
- **The `layout` field on each route config is silently dropped.** `assembleApp` destructures only `{ path, element }` when building `<Route>` elements — see `technical-issues.md` for the concrete impact this has on the auth module's routes.
- **Catch-all route renders `null`**, i.e. there's no 404 page wired at the assembly level; an unmatched path renders a blank page inside whatever layout is currently active.

## Consumers
- `app/src/AppAssembly.tsx` — the only real invocation.
- `getNavItems()`, `getSearchItems()`, `getModules()` are exported for other parts of the app (e.g. the layout package's menu components, a command palette via `kbar`) to read the merged registries.
