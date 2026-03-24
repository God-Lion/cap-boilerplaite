import type { CSSObject } from '@emotion/react'
import type { ReactNode, ReactElement } from 'react'
import type {
  MenuItemStylesParams,
  MenuItemStyles,
  RenderExpandIconParams,
  RenderExpandIcon,
  RenderExpandedMenuItemIcon,
  MenuProps as ThemeMenuProps,
} from '@cap/theme'

export type {
  MenuItemStylesParams,
  MenuItemStyles,
  RenderExpandIconParams,
  RenderExpandIcon,
  RenderExpandedMenuItemIcon,
}

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

export interface MenuProps extends ThemeMenuProps {
  // Any layout-specific overrides for MenuProps can go here
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
