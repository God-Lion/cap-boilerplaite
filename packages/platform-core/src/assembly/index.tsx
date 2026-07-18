import React from 'react'
import { Routes, Route } from 'react-router-dom'
import i18next from 'i18next'
import { CAPModule, SearchItemConfig } from '../types'
import { useAppStore } from '@cap/platform-store'

interface AssembleAppProps {
  modules: Array<CAPModule>
}

// Internal registries
let _searchItems: SearchItemConfig[] = []
let _modules: CAPModule[] = []

/**
 * Returns all merged navigation items from all registered modules.
 */
export const getNavItems = () => useAppStore.getState().navItems

/**
 * Returns all merged search items from all registered modules.
 */
export const getSearchItems = () => _searchItems

/**
 * Returns all registered modules.
 */
export const getModules = () => _modules

// LayoutOverride values that a route config entry can declare.
// Kept in sync with LayoutOverride in store/slices/settingsSlice.ts.
export type RouteLayout = 'public' | 'vertical' | 'horizontal' | 'noLayout' | 'admin'

export type AuthRouteConfig = {
  path: string
  element: React.JSX.Element
  layout?: RouteLayout
}

export const assembleApp = ({ modules }: AssembleAppProps) => {
  // Reset registries on every call (useful for HMR or multiple assemblies)
  _modules.length = 0
  _modules.push(...modules)
  _searchItems.length = 0

  // Sync with reactive store
  useAppStore.getState().clearNavigation()
  const seenSearchIds = new Set<string>()

  // Register module i18n resources
  modules.forEach((module) => {
    if (module.i18n) {
      Object.entries(module.i18n).forEach(([lang, resources]) => {
        i18next.addResourceBundle(lang.toLowerCase(), 'translation', resources, true, true)
        i18next.addResourceBundle(lang.toLowerCase(), 'common', resources, true, true)
      })
    }

    if (module.navItems) {
      useAppStore.getState().registerModuleNavigation(module.navItems)
    }

    if (module.searchItems) {
      module.searchItems.forEach((item) => {
        if (!seenSearchIds.has(item.id)) {
          seenSearchIds.add(item.id)
          _searchItems.push(item)
        }
      })
    }
  })

  // Collect all route configs from all modules
  const allRouteConfigs: AuthRouteConfig[] = []
  const seenPaths = new Set<string>()

  modules.forEach((module) => {
    if (module.authRouteConfig) {
      module.authRouteConfig.forEach((route: any) => {
        if (!seenPaths.has(route.path)) {
          seenPaths.add(route.path)
          allRouteConfigs.push(route)
        }
      })
    }
  })

  // Return the App component with a SINGLE Routes component matching.
  const App = () => {
    return (
      <Routes>
        {allRouteConfigs.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path='*' element={null} />
      </Routes>
    )
  }

  return App
}
