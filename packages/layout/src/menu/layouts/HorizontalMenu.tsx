import { useTheme, alpha } from '@mui/material/styles'
import type { Dictionary } from '@cap/shared-types'
import { useSettings } from '@cap/platform-store'
import { 
  HorizontalNav, 
  Menu 
} from '../horizontal-menu'
import { useVerticalNav } from '../contexts/verticalNavContext'
import NavbarContent from './HorizontalNavbarContent'
import type { 
  VerticalMenuContextProps 
} from '../components/vertical-menu/Menu'
import StyledHorizontalNavExpandIcon from '../styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '../styles/vertical/StyledVerticalNavExpandIcon'
import menuItemStyles from '../../styles/core/horizontal/menuItemStyles'
import menuRootStyles from '../../styles/core/horizontal/menuRootStyles'
import verticalNavigationCustomStyles from '../../styles/core/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '../../styles/core/vertical/menuItemStyles'
import verticalMenuSectionStyles from '../../styles/core/vertical/menuSectionStyles'
import ChevronRight from '@mui/icons-material/ChevronRight'
import ModuleMenuRenderer from './ModuleMenuRenderer'

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
      verticalNavContent={NavbarContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered'
            ? theme.palette.background.paper
            : theme.palette.background.default,
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }: { level?: number }) => <RenderExpandIcon level={level} />}
        menuItemStyles={{
          ...menuItemStyles(settings, theme),
          button: ({ active, level }: { active?: boolean; level?: number }) => ({
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '8px !important',
            margin: '0 4px !important',
            paddingInline: '12px !important',
            '&:hover': {
              background: active
                ? theme.palette.primary.mainOpacity
                : `${alpha(theme.palette.text.primary, 0.08)} !important`,
              '& .tabler-icon, & i': {
                transform: 'translateY(-2px)',
                color: `${theme.palette.primary.main} !important`,
                transition: 'all 0.3s ease',
              },
            },
            ...(active &&
              level === 0 && {
                background: `${theme.palette.primary.mainOpacity} !important`,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 4,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background: theme.palette.primary.main,
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
          transitionDuration,
          rootStyles: {},
          textTruncate: true,
          subMenuOpenBehavior: 'accordion',
          menuItemStyles: {
            ...verticalMenuItemStyles(verticalNavOptions, theme, settings),
            button: {
              borderRadius: '8px !important',
              margin: '2px 8px !important',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: theme.palette.action.hover,
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
        <ModuleMenuRenderer variant='horizontal' dictionary={dictionary} />
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
