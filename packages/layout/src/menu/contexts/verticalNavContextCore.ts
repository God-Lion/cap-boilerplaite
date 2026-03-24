import React from 'react'
import { useVerticalNav as useZustandVerticalNav } from '@cap/platform-core'
import type { VerticalNavState } from '@cap/theme'
export type { VerticalNavState }
import { VerticalMenuContext, type VerticalMenuContextProps } from './verticalMenuContext'

export interface VerticalNavContextProps extends VerticalNavState {
  updateVerticalNavState: (values: Partial<VerticalNavState>) => void
  collapseVerticalNav: (value?: boolean) => void
  hoverVerticalNav: (value?: boolean) => void
  toggleVerticalNav: (value?: boolean) => void
}

export const VerticalNavContext = React.createContext<VerticalNavContextProps | null>(null)

export const useVerticalNav = (): VerticalNavContextProps => {
  return useZustandVerticalNav()
}

export const useVerticalMenu = (): VerticalMenuContextProps => {
  const context = React.useContext(VerticalMenuContext)

  if (!context) {
    throw new Error('useVerticalMenu must be used within a VerticalMenuContext.Provider')
  }

  return context
}
