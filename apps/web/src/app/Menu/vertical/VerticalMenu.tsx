/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useSettings, type Dictionary } from '@cap/platform-core'
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
import { Path } from '@cap/module-auth'

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
        menuItemStyles={{
          ...menuItemStyles(verticalNavOptions, theme, settings),
          button: ({ active, level }) => ({
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '10px !important',
            margin: '4px 12px !important',
            paddingInline: '12px !important',
            '&:hover': {
              background: active
                ? 'var(--mui-palette-primary-mainOpacity)'
                : 'var(--premium-gradient) !important',
              transform: 'translateX(4px)',
              '& .tabler-icon, & i': {
                transform: 'scale(1.15)',
                color: 'var(--mui-palette-primary-main) !important',
                transition: 'all 0.3s ease',
              },
            },
            ...(active &&
              level === 0 && {
                background: 'var(--mui-palette-primary-mainOpacity) !important',
                boxShadow: '0 4px 12px 0 rgba(var(--mui-palette-primary-mainChannel), 0.2)',
              }),
          }),
          label: {
            fontWeight: 500,
            letterSpacing: '0.01rem',
          },
        }}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon open={open} transitionDuration={transitionDuration} />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={{
          ...menuSectionStyles(verticalNavOptions, theme),
          root: {
            marginBlockStart: '15px !important',
            '& .ts-menu-section-label': {
              color: 'var(--mui-palette-text-disabled) !important',
              fontSize: '0.75rem !important',
              fontWeight: '700 !important',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            },
          },
        }}
      >
        {/* IDaaS Auth & Management Section */}
        <MenuSection label={dictionary['navigation']?.idaas || 'IDaaS Core'}>
          {/* Identity Flows */}
          <SubMenu
            label={dictionary['navigation']?.authPages || 'Identity Control'}
            icon={<i className='tabler-shield-lock' />}
          >
            <MenuItem component={Link} to={Path.auth.signin}>
              {dictionary['navigation']?.login || 'Sign In'}
            </MenuItem>
            <MenuItem component={Link} to={Path.auth.signup}>
              {dictionary['navigation']?.register || 'Register'}
            </MenuItem>
            <MenuItem component={Link} to={Path.auth.forgotPassword}>
              {dictionary['navigation']?.forgotPassword || 'Recovery'}
            </MenuItem>
          </SubMenu>

          {/* Core Management - Promoted to top of section */}
          <MenuItem component={Link} to={Path.admin.users} icon={<i className='tabler-users' />}>
            {dictionary['navigation']?.userManagement || 'Users'}
          </MenuItem>
          <MenuItem
            component={Link}
            to={Path.admin.organizations}
            icon={<i className='tabler-building' />}
          >
            {dictionary['navigation']?.organizations || 'Organizations'}
          </MenuItem>

          {/* Security Methods */}
          <SubMenu
            label={dictionary['navigation']?.security || 'Security Methods'}
            icon={<i className='tabler-key' />}
          >
            <MenuItem component={Link} to={Path.mfa.dashboard}>
              {dictionary['navigation']?.twoSteps || 'Multi-Factor (MFA)'}
            </MenuItem>
            <MenuItem component={Link} to={Path.passkey.management}>
              {dictionary['navigation']?.passkeys || 'Passkeys'}
            </MenuItem>
            <MenuItem component={Link} to={Path.passwordless.setup}>
              {dictionary['navigation']?.passwordless || 'Passwordless'}
            </MenuItem>
          </SubMenu>

          {/* Advanced Administration */}
          <SubMenu
            label={dictionary['navigation']?.adminPages || 'System Admin'}
            icon={<i className='tabler-settings' />}
          >
            <MenuItem component={Link} to={Path.admin.roles}>
              {dictionary['navigation']?.rbac || 'Roles & Permissions'}
            </MenuItem>
            <MenuItem component={Link} to={Path.admin.provisioning}>
              {dictionary['navigation']?.provisioning || 'Directory Sync'}
            </MenuItem>
            <MenuItem component={Link} to={Path.admin.applications}>
              {dictionary['navigation']?.developer || 'Developer Tools'}
            </MenuItem>
            <MenuItem component={Link} to={Path.auth.oidcConfigBrowser}>
              {dictionary['navigation']?.oidcProtocols || 'SSO Protocols'}
            </MenuItem>
          </SubMenu>

          {/* Monitoring & Analytics */}
          <SubMenu
            label={dictionary['navigation']?.monitoring || 'Insights'}
            icon={<i className='tabler-chart-bar' />}
          >
            <MenuItem component={Link} to={Path.admin.events}>
              {dictionary['navigation']?.authEvents || 'Audit Logs'}
            </MenuItem>
            <MenuItem component={Link} to={Path.admin.health}>
              {dictionary['navigation']?.systemHealth || 'System Health'}
            </MenuItem>
            <MenuItem component={Link} to={Path.monitoring.mfa_analytics}>
              {dictionary['navigation']?.mfaAnalytics || 'Security Metrics'}
            </MenuItem>
          </SubMenu>
        </MenuSection>

        {/* Global Apps & Pages */}
        <MenuSection label={dictionary['navigation']?.appsPages || 'Applications'}>
          <MenuItem component={Link} to='/apps/calendar' icon={<i className='tabler-calendar' />}>
            {dictionary['navigation']?.calendar || 'Calendar'}
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
