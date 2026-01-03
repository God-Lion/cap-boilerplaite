import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  useSettings,
  type Dictionary,
} from '@cap/platform-core'
import {
  Menu,
  SubMenu,
  MenuItem,
  MenuSection,
  useVerticalNav,
  StyledVerticalNavExpandIcon,
  verticalMenuItemStyles as menuItemStyles,
  verticalMenuSectionStyles as menuSectionStyles,
  type VerticalMenuContextProps,
} from '@cap/layout'
import { ChevronRight } from '@mui/icons-material'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Dictionary
  scrollMenu: (container: HTMLElement | null, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon: React.FC<RenderExpandIconProps> = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <ChevronRight />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: (e: React.UIEvent<HTMLElement>) => scrollMenu(e.currentTarget, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container: HTMLElement) => scrollMenu(container, true),
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon open={open} transitionDuration={transitionDuration} />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label={dictionary['navigation']?.appsPages}>
          <SubMenu
            label={dictionary['navigation']?.authPages}
            icon={<i className='tabler-shield-lock' />}
          >
            <SubMenu label={dictionary['navigation']?.login}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <MenuItem component={Link} {...({ to: '/auth/sign-in' } as any)}>
                {dictionary['navigation']?.loginV1}
              </MenuItem>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <MenuItem component={Link} {...({ to: '/auth/sign-in-side' } as any)}>
                {dictionary['navigation']?.loginV2}
              </MenuItem>
            </SubMenu>
          </SubMenu>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
