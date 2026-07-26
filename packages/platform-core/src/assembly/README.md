# Assembly Module

This module is responsible for **assembling multiple CAP modules into a single application**.

## Purpose

The `assembleApp()` function takes an array of `CAPModule` definitions and:
1. **Registers i18n resources** from each module isolated strictly by module namespace into `i18next` (preventing cross-module translation collisions).
2. **Merges navigation items** into the reactive global navigation store.
3. **Collects routes** from all modules into a single `<Routes>` component, preserving layout metadata via `LayoutRouteWrapper`.
4. **Merges search items** for the global search functionality.
5. **Provides a dedicated Not Found (404) catch-all route** (`*`) for unmatched URLs.

## Usage

```typescript
import { assembleApp } from '@cap/platform-core/assembly'
import { AuthModule } from '@cap/module-auth'
import { LandingModule } from '@cap/module-landing'

const App = assembleApp({
  modules: [LandingModule, AuthModule]
})

// App is a React component with all routes merged and wrapped in layout handlers
```

## Exports

- `assembleApp({ modules })` - Main assembly function, returns React component
- `getNavItems()` - Returns merged navigation items from store
- `getSearchItems()` - Returns merged search items
- `getModules()` - Returns all registered modules
- `AuthRouteConfig` - Type for route configuration
- `RouteLayout` - Type for layout variants: `'public' | 'vertical' | 'horizontal' | 'noLayout' | 'admin'`

## How It Works

1. Each `CAPModule` defines its own `authRouteConfig`, `navItems`, `searchItems`, and `i18n`.
2. `assembleApp()` registers translation bundles under module-specific namespaces (`moduleNs = module.id || module.name || 'common'`).
3. `assembleApp()` deduplicates route entries by path (first module wins).
4. Routes are wrapped in `<LayoutRouteWrapper element={element} layout={layout} />` to properly handle layout overrides (such as `noLayout` or `admin`).
5. Wildcard route (`*`) maps to the dedicated `NotFound` component inside `LayoutRouteWrapper`.
6. Navigation items are synced to the reactive Zustand store for real-time menu updates.
