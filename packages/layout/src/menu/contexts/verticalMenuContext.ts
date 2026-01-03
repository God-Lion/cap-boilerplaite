import React from 'react'
import type { CSSObject } from '@emotion/styled'
import type { MenuItemStyles, RenderExpandIconParams, RenderExpandedMenuItemIcon } from '../types'

export type MenuSectionStyles = {
  root?: CSSObject
  label?: CSSObject
  prefix?: CSSObject
  suffix?: CSSObject
  icon?: CSSObject
}

export type OpenSubmenu = {
  level: number
  label: React.ReactNode
  active: boolean
  id: string
}

export type VerticalMenuContextProps = {
  browserScroll?: boolean
  triggerPopout?: 'hover' | 'click'
  transitionDuration?: number
  menuSectionStyles?: MenuSectionStyles
  menuItemStyles?: MenuItemStyles
  subMenuOpenBehavior?: 'accordion' | 'collapse'
  renderExpandIcon?: (params: RenderExpandIconParams) => React.ReactElement
  renderExpandedMenuItemIcon?: RenderExpandedMenuItemIcon
  collapsedMenuSectionLabel?: React.ReactNode
  popoutMenuOffset?: {
    mainAxis?: number | ((params: { level?: number }) => number)
    alignmentAxis?: number | ((params: { level?: number }) => number)
  }
  textTruncate?: boolean
  openSubmenu?: Array<OpenSubmenu>
  openSubmenusRef?: React.MutableRefObject<Array<OpenSubmenu>>
  toggleOpenSubmenu?: (
    ...submenus: {
      level: number
      label: React.ReactNode
      active?: boolean
      id: string
    }[]
  ) => void
}

export const VerticalMenuContext = React.createContext({} as VerticalMenuContextProps)
