/**
 * Horizontal Navigation Context - Backward Compatibility Layer
 *
 * This file re-exports Zustand hooks for backward compatibility.
 * All new code should import directly from '@cap/platform-core'
 *
 * @deprecated Use `import { useHorizontalNav } from '@cap/platform-core'` instead
 */

import React from 'react'
import { useHorizontalNav as useZustandHorizontalNav } from '@cap/platform-core'
import {
  HorizontalMenuContext,
  HorizontalMenuContextProps,
} from '../components/horizontal-menu/Menu'

export interface HorizontalNavState {
  isBreakpointReached?: boolean
}

export interface HorizontalNavContextProps extends HorizontalNavState {
  updateIsBreakpointReached: (isBreakpointReached: boolean) => void
}

// Context for backward compatibility (not actually used)
export const HorizontalNavContext = React.createContext<HorizontalNavContextProps | null>(null)

// Provider for backward compatibility (not actually used)
export const HorizontalNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

/**
 * @deprecated Use `import { useHorizontalNav } from '@cap/platform-core'` instead
 */
export const useHorizontalNav = (): HorizontalNavContextProps => {
  return useZustandHorizontalNav()
}

/**
 * @deprecated Use `import { useHorizontalNav } from 'src/store'` instead
 */
export const useHorizontalMenu = (): HorizontalMenuContextProps => {
  // Import the HorizontalMenuContext from Menu component
  const context = React.useContext(HorizontalMenuContext)

  if (!context) {
    throw new Error('useHorizontalMenu must be used within a HorizontalMenuContext.Provider')
  }

  return context
}

export default HorizontalNavContext
