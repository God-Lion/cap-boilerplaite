import React from 'react'
import { useAppStore, type RouteLayout } from '@cap/platform-core'

export interface LayoutRouteWrapperProps {
  element: React.ReactNode
  layout?: RouteLayout
}

/**
 * Wraps a route element and syncs the layoutOverride Zustand slice based on
 * the layout value declared in AuthRouteConfig.
 *
 * Admin routes do NOT need to set layoutOverride here — AdminRoute.tsx handles
 * that directly (it calls updateLayoutOverride('admin') in a useEffect).
 * This wrapper handles non-default layout overrides like 'noLayout'.
 */
export const LayoutRouteWrapper: React.FC<LayoutRouteWrapperProps> = ({
  element,
  layout,
}) => {
  const updateLayoutOverride = useAppStore((state) => state.updateLayoutOverride)

  React.useEffect(() => {
    if (layout === 'noLayout') {
      updateLayoutOverride('noLayout')
      return () => updateLayoutOverride('none')
    }
    // 'admin' override is set by AdminRoute itself — no action needed here
  }, [layout, updateLayoutOverride])

  return (
    <div className='premium-auth-container' style={{ display: 'contents' }}>
      {element}
    </div>
  )
}

export default LayoutRouteWrapper
