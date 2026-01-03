import Box from '@mui/material/Box'
import classnames from 'classnames'
import NavToggle from './NavToggle'
import { useHorizontalNav } from '../../menu/contexts/horizontalNavContext'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'
import { RoleIndicator } from '@cap/platform-core'
import LanguageDropdown from '../../../../../apps/web/src/app/Menu/shared/LanguageDropdown'
import ModeDropdown from '../../../../../apps/web/src/app/Menu/shared/ModeDropdown'
import NotificationsDropdown, {
  NotificationsType,
} from '../../../../../apps/web/src/app/Menu/shared/NotificationsDropdown'
import NavSearch from '../../../../../apps/web/src/app/Menu/shared/search'
import ShortcutsDropdown, {
  ShortcutsType,
} from '../../../../../apps/web/src/app/Menu/shared/ShortcutsDropdown'
import UserDropdown from '../../../../../apps/web/src/app/Menu/shared/UserDropdown'
import Logo from '../../assets/svg/Logo'

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
    url: '/apps/user/list',
    icon: 'tabler-user',
    title: 'Users',
    subtitle: 'Manage Users',
  },
  {
    url: '/apps/roles',
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
    url: '/pages/account-settings',
    icon: 'tabler-settings',
    title: 'Settings',
    subtitle: 'Account Settings',
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
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Logo />}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <NavSearch />
        <RoleIndicator showLabel={true} size='small' />
        <LanguageDropdown />
        <ModeDropdown />
        <ShortcutsDropdown shortcuts={shortcuts} />
        <NotificationsDropdown notifications={notifications} />
        <UserDropdown />
        {/* Language Dropdown, Notification Dropdown, quick access menu dropdown, user dropdown will be placed here */}
      </Box>
    </Box>
  )
}

export default NavbarContent
