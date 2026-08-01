import React from 'react'
import { useAppStore } from '@cap/platform-store'

export type RouteLayout = 'public' | 'vertical' | 'horizontal' | 'noLayout' | 'admin'

export interface LayoutRouteWrapperProps {
  element?: React.ReactNode
  children?: React.ReactNode
  layout?: RouteLayout | string
}

/**
 * Wraps a route element and syncs the layoutOverride Zustand slice based on
 * the layout value declared in AuthRouteConfig.
 */
export const LayoutRouteWrapper: React.FC<LayoutRouteWrapperProps> = ({
  element,
  children,
  layout,
}) => {
  const updateLayoutOverride = useAppStore((state) => state.updateLayoutOverride)

  React.useEffect(() => {
    if (layout === 'noLayout') {
      updateLayoutOverride('noLayout')
      return () => updateLayoutOverride('none')
    }
  }, [layout, updateLayoutOverride])

  const content = children ?? element

  return (
    <div className='premium-auth-container' style={{ display: 'contents' }}>
      {content}
    </div>
  )
}

export default LayoutRouteWrapper
