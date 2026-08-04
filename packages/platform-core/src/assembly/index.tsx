import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CAPModule } from '../types'
import { useAppStore } from '@cap/platform-store'
import { LayoutRouteWrapper } from '@cap/layout'
import { NotFound } from '../components/NotFound'
import { ModuleRegistry, type AuthRouteConfig } from './ModuleRegistry'

export type { AuthRouteConfig }

interface AssembleAppProps {
  modules: Array<CAPModule>
}

/**
 * Returns all merged navigation items from all registered modules.
 */
export const getNavItems = () => useAppStore.getState().navItems

/**
 * Returns all merged search items from all registered modules.
 */
export const getSearchItems = () => ModuleRegistry.getInstance().getSearchItems()

/**
 * Returns all registered modules.
 */
export const getModules = () => ModuleRegistry.getInstance().getModules()

export const assembleApp = ({ modules }: AssembleAppProps) => {
  const registry = ModuleRegistry.getInstance()
  registry.reset()

  modules.forEach((module) => {
    registry.registerModule(module)
  })

  const { allRouteConfigs, routeNavItems, navItemsToRegister } = registry.extractRoutesAndNav()

  // Return the App component with a SINGLE Routes component matching.
  const App = () => {
    React.useEffect(() => {
      useAppStore.getState().clearNavigation()
      navItemsToRegister.forEach((items) => {
        if (items) useAppStore.getState().registerModuleNavigation(items)
      })
      if (routeNavItems.length > 0) {
        useAppStore.getState().registerModuleNavigation(routeNavItems)
      }
    }, [])
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

