import { useTheme, alpha } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import type { Dictionary } from '@cap/shared-types';
import { useSettings } from '@cap/platform-store';
import { useVerticalNav } from '../../hooks/useVerticalNav';
import { Menu } from '../vertical-menu';
import type { VerticalMenuContextProps } from '../components/vertical-menu/Menu';
import StyledVerticalNavExpandIcon from '../styles/vertical/StyledVerticalNavExpandIcon';
import menuItemStyles from '../../styles/core/vertical/menuItemStyles';
import menuSectionStyles from '../../styles/core/vertical/menuSectionStyles';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ModuleMenuRenderer from './ModuleMenuRenderer';

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

const AdminMenu = ({ dictionary, scrollMenu }: Props) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
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
          button: ({ active, level }: { active?: boolean; level?: number }) => ({
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '10px !important',
            margin: '4px 12px !important',
            paddingInline: '12px !important',
            '&:hover': {
              background: active
                ? theme.palette.primary.mainOpacity
                : 'var(--premium-gradient) !important',
              transform: 'translateX(4px)',
            },
            ...(active &&
              level === 0 && {
                background: `${theme.palette.primary.mainOpacity} !important`,
                boxShadow: `0 4px 12px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
              }),
          }),
          label: { fontWeight: 500, letterSpacing: '0.01rem' },
        }}
        renderExpandIcon={({ open }: { open?: boolean }) => (
          <RenderExpandIcon open={open} transitionDuration={transitionDuration} />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={{
          ...menuSectionStyles(verticalNavOptions, theme),
          root: {
            marginBlockStart: '15px !important',
            '& .ts-menu-section-label': {
              color: `${theme.palette.text.disabled} !important`,
              ...theme.typography.overline,
            },
          },
        }}
      >
        <ModuleMenuRenderer variant='admin' dictionary={dictionary} />
      </Menu>
    </ScrollWrapper>
  )
}

export default AdminMenu
