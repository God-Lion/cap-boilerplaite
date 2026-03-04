import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { useSettings, type Dictionary } from '@cap/platform-core'
import {
  HorizontalNav,
  HorizontalMenu as Menu,
  HorizontalSubMenu as SubMenu,
  HorizontalMenuItem as MenuItem,
  VerticalNavContent,
  useVerticalNav,
  StyledHorizontalNavExpandIcon,
  StyledVerticalNavExpandIcon,
  horizontalMenuItemStyles as menuItemStyles,
  horizontalMenuRootStyles as menuRootStyles,
  verticalNavigationCustomStyles,
  verticalMenuItemStyles,
  verticalMenuSectionStyles,
  type VerticalMenuContextProps,
} from '@cap/layout'
import { ChevronRight } from '@mui/icons-material'
import { Path } from '@cap/module-auth'
import { PermissionGuard, RoleGuard, Roles } from '@cap/platform-core'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <ChevronRight className='tabler-chevron-right' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <ChevronRight className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)
const HorizontalMenu = ({ dictionary }: { dictionary: Dictionary }) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { settings } = useSettings()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered'
            ? 'var(--mui-palette-background-paper)'
            : 'var(--mui-palette-background-default)',
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }: { level?: number }) => <RenderExpandIcon level={level} />}
        menuItemStyles={{
          ...menuItemStyles(settings, theme),
          button: ({ active, level }) => ({
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '8px !important',
            margin: '0 4px !important',
            paddingInline: '12px !important',
            '&:hover': {
              background: active
                ? 'var(--mui-palette-primary-mainOpacity)'
                : 'hsla(var(--mui-mainColor-hsl), 0.08) !important',
              '& .tabler-icon, & i': {
                transform: 'translateY(-2px)',
                color: 'var(--mui-palette-primary-main) !important',
                transition: 'all 0.3s ease',
              },
            },
            ...(active &&
              level === 0 && {
                background: 'var(--mui-palette-primary-mainOpacity) !important',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 4,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background: 'var(--mui-palette-primary-main)',
                  borderRadius: '99px',
                  animation: 'scaleIn 0.3s ease',
                },
              }),
          }),
        }}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }: { level?: number }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0,
        }}
        verticalMenuProps={{
          menuItemStyles: {
            ...verticalMenuItemStyles(verticalNavOptions, theme, settings),
            button: {
              borderRadius: '8px !important',
              margin: '2px 8px !important',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'var(--premium-gradient) !important',
              },
            },
          },
          renderExpandIcon: ({ open }: { open?: boolean }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme),
        }}
      >
        {/* IDaaS Core - Flattened for speed */}
        <SubMenu
          label={dictionary['navigation']?.idaas || 'Identity Control'}
          icon={<i className='tabler-shield-half' />}
        >
          {/* Identity Management Dropdown */}
          <RoleGuard require={[Roles.ADMIN, Roles.SUPERADMIN, Roles.SUPERADMINEMPLOYEE, Roles.PROVIDERADMIN]}>
            <SubMenu
              label={dictionary['navigation']?.userManagement || 'Management'}
              icon={<i className='tabler-users' />}
            >
              <MenuItem component={Link} to={Path.admin.users}>
                {dictionary['navigation']?.list || 'User Directory'}
              </MenuItem>
              <MenuItem component={Link} to={Path.admin.organizations}>
                {dictionary['navigation']?.list || 'Organizations'}
              </MenuItem>
              <PermissionGuard require={['admin.access']} logic='OR'>
                <MenuItem component={Link} to={Path.admin.roles}>
                  {dictionary['navigation']?.roles || 'Access Roles'}
                </MenuItem>
              </PermissionGuard>
            </SubMenu>
          </RoleGuard>

          {/* Flows Dropdown */}
          <SubMenu
            label={dictionary['navigation']?.authPages || 'Flows'}
            icon={<i className='tabler-arrows-left-right' />}
          >
            <MenuItem component={Link} to={Path.auth.signin}>
              {dictionary['navigation']?.login || 'Sign In'}
            </MenuItem>
            <MenuItem component={Link} to={Path.auth.signup}>
              {dictionary['navigation']?.register || 'Sign Up'}
            </MenuItem>
            <MenuItem component={Link} to={Path.auth.forgotPassword}>
              {dictionary['navigation']?.forgotPassword || 'Recovery'}
            </MenuItem>
          </SubMenu>

          {/* Security Dropdown */}
          <SubMenu
            label={dictionary['navigation']?.security || 'Security'}
            icon={<i className='tabler-lock-square' />}
          >
            <MenuItem component={Link} to={Path.mfa.dashboard}>
              {dictionary['navigation']?.twoSteps || 'Multi-Factor (MFA)'}
            </MenuItem>
            <MenuItem component={Link} to={Path.passkey.management}>
              {dictionary['navigation']?.passkeys || 'Passkeys'}
            </MenuItem>
            <PermissionGuard require={['admin.access']} logic='OR'>
              <MenuItem component={Link} to={Path.auth.oidcConfigBrowser}>
                {dictionary['navigation']?.oidcProtocols || 'SSO Protocols'}
              </MenuItem>
            </PermissionGuard>
          </SubMenu>

          {/* Insights Dropdown */}
          <RoleGuard require={[Roles.ADMIN, Roles.SUPERADMIN, Roles.SUPERADMINEMPLOYEE]}>
            <SubMenu
              label={dictionary['navigation']?.monitoring || 'Insights'}
              icon={<i className='tabler-activity' />}
            >
              <MenuItem component={Link} to={Path.admin.events}>
                {dictionary['navigation']?.authEvents || 'Audit Logs'}
              </MenuItem>
              <MenuItem component={Link} to={Path.admin.health}>
                {dictionary['navigation']?.systemHealth || 'System Health'}
              </MenuItem>
            </SubMenu>
          </RoleGuard>
        </SubMenu>

        <SubMenu
          label={dictionary['navigation']?.dashboards}
          icon={<i className='tabler-smart-home' />}
        >
          <MenuItem icon={<i className='tabler-chart-pie-2' />}>
            {dictionary['navigation']?.crm}
          </MenuItem>
          <MenuItem icon={<i className='tabler-trending-up' />}>
            {dictionary['navigation']?.analytics}
          </MenuItem>
          <MenuItem icon={<i className='tabler-shopping-cart' />}>
            {dictionary['navigation']?.eCommerce}
          </MenuItem>
        </SubMenu>

        {/* ... Rest of the original menu items can follow or be removed ... */}
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
