import type { CSSObject } from '@emotion/react'
import type { ReactNode, ReactElement } from 'react'

export interface MenuItemStylesParams {
  level: number
  disabled?: boolean
  active?: boolean
  isSubmenu?: boolean
  open?: boolean
}

export interface MenuItemStyles {
  root?: ((params: MenuItemStylesParams) => CSSObject) | CSSObject
  button?: ((params: MenuItemStylesParams) => CSSObject) | CSSObject
  icon?: ((params: MenuItemStylesParams) => CSSObject) | CSSObject
  label?: ((params: MenuItemStylesParams) => CSSObject) | CSSObject
  prefix?: CSSObject
  suffix?: CSSObject
  subMenuStyles?: CSSObject
  subMenuExpandIcon?: CSSObject
  subMenuContent?: ((params: MenuItemStylesParams) => CSSObject) | CSSObject
}

export interface RenderExpandIconParams {
  level: number
  active?: boolean
  open?: boolean
  disabled?: boolean
}

export type RenderExpandIcon = (params: RenderExpandIconParams) => ReactNode

export interface MenuItemElement {
  type?: 'item' | 'submenu' | 'section'
  href?: string
  icon?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  children?: MenuItemElement[]
  label?: ReactNode
  disabled?: boolean
  target?: string
  rel?: string
}

export type MenuItemElementKey = keyof MenuItemStyles

export interface ChildrenType {
  children?: ReactNode
}

export interface RenderExpandedMenuItemIcon {
  icon?:
    | ReactElement
    | ((params: { level?: number; active?: boolean; disabled?: boolean }) => ReactElement | null)
    | null
  level?: number
}

// Common menu props
export interface MenuItemProps {
  href?: string
  icon?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  disabled?: boolean
  target?: string
  rel?: string
  children?: ReactNode
  className?: string
  rootStyles?: CSSObject
  component?: ReactElement
  [key: string]: unknown
}

export interface SubMenuProps extends MenuItemProps {
  label?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  verticalMenuProps?: Record<string, unknown>
}

export interface MenuProps {
  children?: ReactNode
  className?: string
  rootStyles?: CSSObject
  menuItemStyles?: MenuItemStyles
  renderExpandIcon?: RenderExpandIcon
  renderExpandedMenuItemIcon?: RenderExpandedMenuItemIcon
  triggerPopout?: 'hover' | 'click'
  popoutMenuOffset?: { mainAxis?: number; alignmentAxis?: number }
  textTruncate?: boolean
  transitionDuration?: number
  browserScroll?: boolean
}

export interface NavHeaderProps {
  children?: ReactNode
  className?: string
}

export interface MenuSectionProps {
  label?: ReactNode
  icon?: ReactNode
  children?: ReactNode
  className?: string
  rootStyles?: CSSObject
  prefix?: ReactNode
  suffix?: ReactNode
}

export type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface RootStylesType {
  rootStyles?: CSSObject
}

export interface MenuButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: string | ReactElement | React.ComponentType<any>
  children?: ReactNode
}

export type SubMenuItemElement =
  | 'root'
  | 'button'
  | 'icon'
  | 'label'
  | 'prefix'
  | 'suffix'
  | 'subMenuStyles'
  | 'subMenuExpandIcon'
  | 'subMenuContent'
