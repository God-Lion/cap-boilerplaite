import React from 'react'
import { Routes, Route } from 'react-router-dom'
import i18next from 'i18next'
import { CAPModule, SearchItemConfig } from '../types'
import { useAppStore } from '@cap/platform-store'
import { LayoutRouteWrapper } from '@cap/layout'
import { NotFound } from '../components/NotFound'


import { registerDictionary } from '../i18n/registry'

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

import type { ModuleRouteConfig } from '@cap/shared-types'

export type AuthRouteConfig = ModuleRouteConfig & {
  element: React.JSX.Element
}

export const assembleApp = ({ modules }: AssembleAppProps) => {
  // Reset registries on every call (useful for HMR or multiple assemblies)
  _modules.length = 0
  _modules.push(...modules)
  _searchItems.length = 0

  // Sync with reactive store
  useAppStore.getState().clearNavigation()
  const seenSearchIds = new Set<string>()

  // Register module i18n resources isolated strictly by module name/id
  const i18nInstance = (i18next as any)?.default || i18next
  if (!i18nInstance.isInitialized && typeof i18nInstance.init === 'function') {
    i18nInstance.init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {},
      interpolation: { escapeValue: false },
    })
  }

  modules.forEach((module) => {
    const moduleNs = module.id || (module as any).name || 'common'
    if (module.i18n) {
      registerDictionary(module.i18n as any)
      Object.entries(module.i18n).forEach(([lang, resources]) => {
        const langLower = lang.toLowerCase()
        i18nInstance.addResourceBundle(langLower, moduleNs, resources, true, true)
        i18nInstance.addResourceBundle(langLower, 'translation', resources, true, true)
        i18nInstance.addResourceBundle(langLower, 'common', resources, true, true)
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
  const routeNavItems: typeof _modules[0]['navItems'] = []

  modules.forEach((module) => {
    const routesToRegister = module.routes || module.authRouteConfig
    if (routesToRegister) {
      routesToRegister.forEach((route: any) => {
        if (route && route.path && !seenPaths.has(route.path)) {
          seenPaths.add(route.path)
          allRouteConfigs.push(route)

          // Auto-extract nav item from route if it has nav-specific properties
          if (route.variant || route.roles || route.guestOnly || route.icon) {
            routeNavItems.push({
              id: route.id || route.path,
              label: route.label || route.path,
              path: route.path,
              icon: route.icon,
              section: route.section,
              roles: route.roles,
              permissions: route.permissions,
              guestOnly: route.guestOnly,
              variant: route.variant,
              order: route.order,
            })
          }
        }
      })
    }
  })

  if (routeNavItems.length > 0) {
    useAppStore.getState().registerModuleNavigation(routeNavItems)
  }


  // Return the App component with a SINGLE Routes component matching.
  const App = () => {
    return (
      <React.Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(0,0,0,0.1)',
                borderTopColor: 'var(--color-primary, #635bff)',
                borderRadius: '50%',
                animation: 'cap-spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes cap-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        }
      >
        <Routes>
          {allRouteConfigs.map(({ path, element, layout, label }) => (
            <Route
              key={path}
              path={path}
              element={
                <LayoutRouteWrapper layout={layout || 'none'} label={label}>
                  {element}
                </LayoutRouteWrapper>
              }
            />
          ))}
          <Route path='*' element={<LayoutRouteWrapper layout='none'><NotFound /></LayoutRouteWrapper>} />
        </Routes>
      </React.Suspense>
    )
  }


  return App
}
