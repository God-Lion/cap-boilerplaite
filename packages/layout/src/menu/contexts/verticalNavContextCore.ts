import React from 'react'
import { VerticalNavState } from '@cap/shared-types'
export type { VerticalNavState }
import { VerticalMenuContext, type VerticalMenuContextProps } from './verticalMenuContext'

export interface VerticalNavContextProps extends VerticalNavState {
  updateVerticalNavState: (values: Partial<VerticalNavState>) => void
  collapseVerticalNav: (value?: boolean) => void
  hoverVerticalNav: (value?: boolean) => void
  toggleVerticalNav: (value?: boolean) => void
}

export const VerticalNavContext = React.createContext<VerticalNavContextProps | null>(null)

import { useVerticalNav as useLocalVerticalNav } from '../../hooks/useVerticalNav'

export const useVerticalNav = (): VerticalNavContextProps => {
  return useLocalVerticalNav() as any // Cast for now, will refine types later
}

export const useVerticalMenu = (): VerticalMenuContextProps => {
  const context = React.useContext(VerticalMenuContext)

  if (!context) {
    throw new Error('useVerticalMenu must be used within a VerticalMenuContext.Provider')
  }

  return context
}
