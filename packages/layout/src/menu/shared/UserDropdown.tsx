import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { MouseEvent } from 'react'
import {
  Avatar,
  Badge,
  Box,
  Button,
  ClickAwayListener,
  CircularProgress,
  Divider,
  Fade,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles'
import AttachMoney from '@mui/icons-material/AttachMoney'
import Help from '@mui/icons-material/Help'
import Logout from '@mui/icons-material/Logout'
import Person from '@mui/icons-material/Person'
import Settings from '@mui/icons-material/Settings'
import { useSettings, useAppStore } from '@cap/platform-store'
import { useAuth } from '@cap/platform-core'
import { AppPaths, resolveDynamicPath } from '@cap/shared-types'
import { zIndexScale } from '@cap/theme'
import { useTranslation } from 'react-i18next'

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}))

const UserDropdown = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navItems = useAppStore((state) => state.navItems)
  const { user: authUser, logout, isLoggingOut } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const { settings } = useSettings()

  // Dynamically resolve route paths from registered module navItems ("Magnet Legos")
  const profilePath = React.useMemo(
    () => resolveDynamicPath(navItems, 'user-profile', AppPaths.account.overview),
    [navItems]
  )
  const settingsPath = React.useMemo(
    () => resolveDynamicPath(navItems, 'account-settings', AppPaths.account.edit),
    [navItems]
  )
  const pricingPath = React.useMemo(
    () => resolveDynamicPath(navItems, 'guest-pricing', AppPaths.landing.pricing),
    [navItems]
  )
  const aboutPath = React.useMemo(
    () => resolveDynamicPath(navItems, 'guest-about', AppPaths.landing.about),
    [navItems]
  )

  // Extract user data from IAuth structure
  const user = authUser?.user || authUser

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(open ? null : event.currentTarget)
  }

  const handleDropdownClose = (
    event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent),
    url?: string,
  ) => {
    if (url) navigate(url)

    if (anchorEl && anchorEl.contains(event?.target as HTMLElement)) return

    setAnchorEl(null)
  }

  const handleUserLogout = () => {
    setAnchorEl(null)
    logout()
  }

  return (
    <React.Fragment>
      <Badge
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          marginInlineStart: '0.5rem',
        }}
      >
        <Avatar
          alt={user?.firstName || ''}
          src={user?.avatar || ''}
          onClick={handleDropdownOpen}
          sx={{
            cursor: 'pointer',
            blockSize: '38px',
            inlineSize: '38px',
          }}
        />
      </Badge>
      <Popper
        open={open}
        transition
        placement='bottom-end'
        anchorEl={anchorEl}
        sx={{
          minInlineSize: '240px',
          marginBlockStart: '0.75rem !important',
          zIndex: zIndexScale.dropdown,
        }}
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top',
            }}
          >
            <Paper
              className='glass-effect animate-scale-in'
              sx={{
                borderRadius: '12px !important',
                overflow: 'hidden',
                ...(settings.skin === 'bordered'
                  ? { border: 1, boxShadow: 'none' }
                  : { boxShadow: 'var(--premium-shadow)' }),
              }}
            >
              <ClickAwayListener
                onClickAway={(e) => handleDropdownClose(e as MouseEvent | TouchEvent)}
              >
                <MenuList>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingBlock: '0.5rem',
                      paddingInline: '1.5rem',
                      gap: '0.5rem',
                    }}
                    tabIndex={-1}
                  >
                    <Avatar alt={user?.firstName || ''} src={user?.avatar || ''} />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                        }}
                        color='text.primary'
                      >
                        {user?.firstName || ''}
                      </Typography>
                      <Typography variant='caption'>{user?.email || ''}</Typography>
                    </Box>
                  </Box>
                  <Divider
                    sx={{
                      marginBlock: '0.25rem',
                    }}
                  />
                  <MenuItem
                    onClick={(e) => handleDropdownClose(e, profilePath)}
                    sx={{
                      marginInline: '8px !important',
                      marginBlock: '4px !important',
                      borderRadius: '8px !important',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: `${alpha(theme.palette.text.primary, 0.05)} !important`,
                        transform: 'translateX(4px)',
                        '& svg': { color: 'primary.main' },
                      },
                    }}
                  >
                    <Person sx={{ fontSize: '22px', transition: 'color 0.2s' }} />
                    <Typography color='text.primary' sx={{ fontWeight: 500 }}>
                      {t('navigation.profile')}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => handleDropdownClose(e, settingsPath)}
                    sx={{
                      marginInline: '8px !important',
                      marginBlock: '4px !important',
                      borderRadius: '8px !important',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: `${alpha(theme.palette.text.primary, 0.05)} !important`,
                        transform: 'translateX(4px)',
                        '& svg': { color: 'primary.main' },
                      },
                    }}
                  >
                    <Settings sx={{ fontSize: '22px', transition: 'color 0.2s' }} />
                    <Typography color='text.primary' sx={{ fontWeight: 500 }}>
                      {t('navigation.settings')}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => handleDropdownClose(e, pricingPath)}
                    sx={{
                      marginInline: '0.5rem',
                      gap: '0.75rem',
                    }}
                  >
                    <AttachMoney sx={{ fontSize: '22px' }} />
                    <Typography color='text.primary'>{t('navigation.pricing')}</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => handleDropdownClose(e, aboutPath)}
                    sx={{
                      marginInline: '0.5rem',
                      gap: '0.75rem',
                    }}
                  >
                    <Help sx={{ fontSize: '22px' }} />
                    <Typography color='text.primary'>{t('navigation.about')}</Typography>
                  </MenuItem>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingBlock: '0.5rem',
                      paddingInline: '0.75rem',
                    }}
                  >
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      disabled={isLoggingOut}
                      endIcon={
                        isLoggingOut ? <CircularProgress size={16} color='inherit' /> : <Logout />
                      }
                      onClick={handleUserLogout}
                      sx={{
                        '& .MuiButton-endIcon': { marginInlineStart: 1.5 },
                      }}
                    >
                      {isLoggingOut ? t('navigation.signingOut') : t('navigation.logout')}
                    </Button>
                  </Box>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </React.Fragment>
  )
}

export default UserDropdown


