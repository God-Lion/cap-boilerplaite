import React from 'react'
import i18next from 'i18next'
import { useAppStore } from '@cap/platform-store'

export type RouteLayout = 'public' | 'vertical' | 'horizontal' | 'noLayout' | 'admin'

export interface LayoutRouteWrapperProps {
  element?: React.ReactNode
  children?: React.ReactNode
  layout?: RouteLayout | string
  label?: string
}

/**
 * Wraps a route element and syncs the layoutOverride Zustand slice based on
 * the layout value declared in AuthRouteConfig.
 */
export const LayoutRouteWrapper: React.FC<LayoutRouteWrapperProps> = ({
  element,
  children,
  layout,
  label,
}) => {
  const updateLayoutOverride = useAppStore((state) => state.updateLayoutOverride)

  React.useEffect(() => {
    if (layout === 'noLayout') {
      updateLayoutOverride('noLayout')
      return () => updateLayoutOverride('none')
    }
  }, [layout, updateLayoutOverride])

  React.useEffect(() => {
    if (label) {
      const i18nInstance = (i18next as any)?.default || i18next
      const translated = i18nInstance?.isInitialized && i18nInstance.exists?.(label)
        ? i18nInstance.t(label)
        : (i18nInstance?.t ? i18nInstance.t(label) : label)
      document.title = translated || label
    }
  }, [label])

  const content = children ?? element

  return (
    <div className='premium-auth-container' style={{ display: 'contents' }}>
      {content}
    </div>
  )
}

export default LayoutRouteWrapper
