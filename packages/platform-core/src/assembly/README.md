# Assembly Module

This module is responsible for **assembling multiple CAP modules into a single application**.

## Purpose

The `assembleApp()` function takes an array of `CAPModule` definitions and:
1. **Registers i18n resources** from each module into i18next
2. **Merges navigation items** into the global navigation store
3. **Collects routes** from all modules into a single `<Routes>` component
4. **Merges search items** for the global search functionality

## Usage

```typescript
import { assembleApp } from '@cap/platform-core/assembly'
import { AuthModule } from '@cap/module-auth'
import { AdminModule } from '@cap/module-admin'

const App = assembleApp({
  modules: [AuthModule, AdminModule]
})

// App is a React component with all routes merged
```

## Exports

- `assembleApp({ modules })` - Main assembly function, returns React component
- `getNavItems()` - Returns merged navigation items from store
- `getSearchItems()` - Returns merged search items
- `getModules()` - Returns all registered modules
- `AuthRouteConfig` - Type for route configuration
- `RouteLayout` - Type for layout variants: `'public' | 'vertical' | 'horizontal' | 'noLayout' | 'admin'`

## How It Works

1. Each `CAPModule` defines its own `authRouteConfig`, `navItems`, `searchItems`, and `i18n`
2. `assembleApp()` deduplicates by path/id (first module wins)
3. Routes are collected and rendered in a single `<Routes>` component
4. Navigation is synced to the Redux store for reactive updates
