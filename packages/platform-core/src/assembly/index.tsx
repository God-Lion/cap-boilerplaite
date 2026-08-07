import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CAPModule, RouteLayout } from '../types'
import { useAppStore } from '@cap/platform-store'
import { NotFound } from '../components/NotFound'
import { ModuleRegistry, type AuthRouteConfig } from './ModuleRegistry'

export type { AuthRouteConfig }

/**
 * Contract implemented by a route-layout wrapper injected at the app-assembly
 * layer (e.g. `LayoutRouteWrapper` from `@cap/layout`). platform-core declares
 * this shape but never imports the layout package, keeping the dependency
 * graph acyclic: the shell composes the two packages instead.
 */
export interface RouteElementWrapperProps {
  element?: React.ReactNode
  children?: React.ReactNode
  layout?: RouteLayout | string
  label?: string
}

export type RouteElementWrapper = React.ComponentType<RouteElementWrapperProps>

/**
 * Default no-op wrapper used when no layoutWrapper is injected. Route elements
 * render directly; layout overrides simply aren't applied.
 */
const PassthroughRouteElementWrapper: RouteElementWrapper = ({ children, element }) => (
  <React.Fragment>{children ?? element}</React.Fragment>
)

interface AssembleAppProps {
  modules: Array<CAPModule>
  /**
   * Route wrapper applied to every compiled route (and the catch-all 404).
   * Supplied by the host shell to honor route `layout` intent without
   * platform-core depending on the layout package (inversion of control).
   */
  layoutWrapper?: RouteElementWrapper
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

export const assembleApp = ({ modules, layoutWrapper }: AssembleAppProps) => {
  const registry = ModuleRegistry.getInstance()
  registry.reset()

  modules.forEach((module) => {
    registry.registerModule(module)
  })

  const { allRouteConfigs, routeNavItems, navItemsToRegister } = registry.extractRoutesAndNav()
  const Wrapper = layoutWrapper ?? PassthroughRouteElementWrapper

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
                <Wrapper layout={layout || 'none'} label={label}>
                  {element}
                </Wrapper>
              }
            />
          ))}
          <Route
            path='*'
            element={
              <Wrapper layout='none'>
                <NotFound />
              </Wrapper>
            }
          />
        </Routes>
      </React.Suspense>
    )
  }

  return App
}
