import Box from '@mui/material/Box'
import classnames from 'classnames'
import { horizontalLayoutClasses } from '@cap/theme'
import HorizontalNavToggle from '../../components/horizontal/NavToggle'
import { useHorizontalNav } from '../contexts/horizontalNavContext'
import LanguageDropdown from '../shared/LanguageDropdown'
import ModeDropdown from '../shared/ModeDropdown'
import NotificationsDropdown, { NotificationsType } from '../shared/NotificationsDropdown'
import NavSearch from '../search'
import ShortcutsDropdown, { ShortcutsType } from '../shared/ShortcutsDropdown'
import UserDropdown from '../shared/UserDropdown'
import Logo from '../shared/Logo'
import { RoleIndicator } from '@cap/module-auth'
import { Path } from '@cap/module-auth'

const shortcuts: Array<ShortcutsType> = [
  {
    url: '/apps/calendar',
    icon: 'tabler-calendar',
    title: 'Calendar',
    subtitle: 'Appointments',
  },
  {
    url: '/apps/invoice/list',
    icon: 'tabler-file-dollar',
    title: 'Invoice App',
    subtitle: 'Manage Accounts',
  },
  {
    url: Path.admin.users,
    icon: 'tabler-user',
    title: 'Users',
    subtitle: 'Manage Users',
  },
  {
    url: Path.admin.roles,
    icon: 'tabler-users-group',
    title: 'Role Management',
    subtitle: 'Permissions',
  },
  {
    url: '/',
    icon: 'tabler-device-desktop-analytics',
    title: 'Dashboard',
    subtitle: 'User Dashboard',
  },
  {
    url: Path.account.overview,
    icon: 'tabler-settings',
    title: 'Settings',
    subtitle: 'Account Overview',
  },
]

const notifications: Array<NotificationsType> = [
  {
    avatarImage: '/images/avatars/8.png',
    title: 'Congratulations Flora 🎉',
    subtitle: 'Won the monthly bestseller gold badge',
    time: '1h ago',
    read: false,
  },
  {
    title: 'Cecilia Becker',
    avatarColor: 'secondary',
    subtitle: 'Accepted your connection',
    time: '12h ago',
    read: false,
  },
  {
    avatarImage: '/images/avatars/3.png',
    title: 'Bernard Woods',
    subtitle: 'You have new message from Bernard Woods',
    time: 'May 18, 8:26 AM',
    read: true,
  },
  {
    avatarIcon: 'tabler-chart-bar',
    title: 'Monthly report generated',
    subtitle: 'July month financial report is generated',
    avatarColor: 'info',
    time: 'Apr 24, 10:30 AM',
    read: true,
  },
  {
    avatarText: 'MG',
    title: 'Application has been approved 🚀',
    subtitle: 'Your Meta Gadgets project application has been approved.',
    avatarColor: 'success',
    time: 'Feb 17, 12:17 PM',
    read: true,
  },
  {
    avatarIcon: 'tabler-mail',
    title: 'New message from Harry',
    subtitle: 'You have new message from Harry',
    avatarColor: 'error',
    time: 'Jan 6, 1:48 PM',
    read: true,
  },
]

const NavbarContent = () => {
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <Box
      className={classnames(horizontalLayoutClasses.navbarContent)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        inlineSize: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <HorizontalNavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Logo />}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <NavSearch />
        <RoleIndicator showLabel={true} size='small' />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '& .MuiIconButton-root': {
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'hsla(var(--mui-mainColor-hsl), 0.08)',
                transform: 'translateY(-2px)',
                '& i, & svg': { color: 'primary.main' },
              },
            },
          }}
        >
          <LanguageDropdown />
          <ModeDropdown />
          <ShortcutsDropdown shortcuts={shortcuts} />
          <NotificationsDropdown notifications={notifications} />
        </Box>
        <UserDropdown />
      </Box>
    </Box>
  )
}

export default NavbarContent
