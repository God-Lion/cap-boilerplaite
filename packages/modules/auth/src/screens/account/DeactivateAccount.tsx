import { useState, useCallback, useMemo } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Link as MuiLink,
} from '@mui/material'
import {
  Warning,
  Home,
  Dashboard,
  Folder,
  Description,
  Group,
  Settings,
  Lock,
  CreditCard,
  Logout,
  Menu as MenuIcon,
  Search,
  Notifications as NotificationsIcon,
  GridView,
  ExpandMore,
  Info,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDeactivateAccount, useUserProfile } from '../../hooks'
import Path from '../path'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
}

export default function DeactivateAccount() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [confirmText, setConfirmText] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const deactivateAccountMutation = useDeactivateAccount()

  const mainNavItems: NavItem[] = useMemo(
    () => [
      { id: 'home', label: t('auth.common.home'), icon: <Home />, path: '/' },
      {
        id: 'dashboard',
        label: t('auth.common.dashboard'),
        icon: <Dashboard />,
        path: '/dashboard',
      },
      {
        id: 'projects',
        label: t('auth.common.projects'),
        icon: <Folder />,
        path: '/projects',
      },
      {
        id: 'documents',
        label: t('auth.common.documents'),
        icon: <Description />,
        path: '/documents',
      },
      { id: 'team', label: t('auth.common.team'), icon: <Group />, path: '/team' },
    ],
    [t],
  )

  const accountNavItems: NavItem[] = useMemo(
    () => [
      {
        id: 'settings',
        label: t('auth.settings.settings'),
        icon: <Settings />,
        path: Path.account.settings,
      },
      {
        id: 'security',
        label: t('auth.settings.security'),
        icon: <Lock />,
        path: Path.account.security,
      },
      {
        id: 'billing',
        label: t('auth.account.billing'),
        icon: <CreditCard />,
        path: Path.account.billing,
      },
    ],
    [t],
  )

  const { data: userProfile } = useUserProfile()
  const user = userProfile?.data

  const handleDeactivate = useCallback(async () => {
    if (confirmText !== 'DELETE') {
      return
    }

    if (!user?.id) return

    try {
      await deactivateAccountMutation.mutateAsync(user.id)
      navigate('/auth/account/deactivation-success')
    } catch (error) {
      console.error('Deactivation error:', error)
    }
  }, [confirmText, deactivateAccountMutation, navigate, user])

  const handleCancel = useCallback(() => {
    navigate(Path.account.settings)
  }, [navigate])

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen)
  }, [mobileOpen])

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {mainNavItems.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'inherit',
                  transition: 'color 0.2s',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
          mx: 2,
        }}
      >
        <Typography
          variant='caption'
          sx={{
            px: 1.5,
            pb: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('auth.account.account')}
        </Typography>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {accountNavItems.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => navigate(item.path)}
              selected={item.id === 'settings'}
              sx={{
                borderRadius: 2,
                color: 'text.secondary',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          mt: 'auto',
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <ListItemButton
          onClick={() => navigate('/auth/signout')}
          sx={{
            borderRadius: 2,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'error.light',
              color: 'error.main',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: 'inherit',
            }}
          >
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary={t('auth.account.logout')}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#f6f7f8',
      }}
    >
      {/* Top Navigation */}
      <Box
        component='nav'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          px: { xs: 2, lg: 5 },
          py: 1.5,
          width: '100%',
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <GridView sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 700,
              fontSize: '1.125rem',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {t('auth.common.appName')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            <IconButton>
              <Search />
            </IconButton>
            <IconButton>
              <Badge badgeContent={1} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>

          <Box
            sx={{
              height: 24,
              width: '1px',
              bgcolor: 'divider',
              display: { xs: 'none', sm: 'block' },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                border: 1,
                borderColor: 'divider',
              }}
            >
              JD
            </Avatar>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 500,
                display: { xs: 'none', lg: 'block' },
              }}
            >
              Jane Doe
            </Typography>
            <ExpandMore sx={{ display: { xs: 'none', lg: 'block' } }} />
          </Box>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Desktop Sidebar */}
        <Box
          component='aside'
          sx={{
            display: { xs: 'none', md: 'flex' },
            width: 256,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflowY: 'auto',
          }}
        >
          {sidebarContent}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: 256 },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Main Content */}
        <Box
          component='main'
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 3, lg: 4 },
            width: '100%',
            overflowY: 'auto',
            bgcolor: '#f6f7f8',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 560,
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 2,
              border: 1,
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: 5,
                pb: 1,
                px: { xs: 3, sm: 6 },
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'error.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Warning sx={{ color: 'error.main', fontSize: 40 }} />
              </Box>

              <Typography
                variant='h4'
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.875rem' },
                  letterSpacing: '-0.02em',
                  pb: 1,
                }}
              >
                {t('auth.account.deactivate_title')}
              </Typography>

              <Typography
                variant='body1'
                sx={{
                  color: 'text.secondary',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                {t('auth.account.deactivate_description')}
              </Typography>
            </Box>

            {/* Form Content */}
            <Box sx={{ px: { xs: 3, sm: 6 }, py: 3 }}>
              {deactivateAccountMutation.isError && (
                <Alert severity='error' sx={{ mb: 3 }}>
                  {(deactivateAccountMutation.error as any)?.message ||
                    t('auth.common.errorOccurred')}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Info Box */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    p: 2,
                    bgcolor: 'primary.light',
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'primary.main',
                  }}
                >
                  <Info sx={{ color: 'primary.main', flexShrink: 0, mt: 0.25 }} />
                  <Typography variant='body2' sx={{ fontSize: '0.875rem' }}>
                    {t('auth.account.deactivate_alternative_prefix')}{' '}
                    <MuiLink
                      href='#'
                      onClick={(e) => {
                        e.preventDefault()
                        // Navigate to temporary disable
                      }}
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {t('auth.account.temporarily_disable')}
                    </MuiLink>{' '}
                    {t('auth.account.deactivate_alternative_suffix')}
                  </Typography>
                </Box>

                {/* Confirmation Input */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography
                    component='label'
                    htmlFor='confirm-delete'
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {t('auth.account.deactivate_confirm_instruction')}
                  </Typography>
                  <TextField
                    id='confirm-delete'
                    fullWidth
                    placeholder='DELETE'
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 48,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    gap: 1.5,
                    pt: 1,
                  }}
                >
                  <Button
                    fullWidth
                    variant='outlined'
                    onClick={handleCancel}
                    sx={{
                      height: 44,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    {t('auth.account.cancel')}
                  </Button>
                  <Button
                    fullWidth
                    variant='contained'
                    color='error'
                    onClick={handleDeactivate}
                    disabled={confirmText !== 'DELETE' || deactivateAccountMutation.isPending}
                    sx={{
                      height: 44,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 1,
                    }}
                  >
                    {deactivateAccountMutation.isPending ? (
                      <CircularProgress size={24} color='inherit' />
                    ) : (
                      t('auth.account.deactivate_submit_button')
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                bgcolor: 'grey.50',
                px: 3,
                py: 2,
                borderTop: 1,
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                {t('auth.account.support_prefix')}{' '}
                <MuiLink
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    // Navigate to support
                  }}
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {t('auth.account.customer_support')}
                </MuiLink>{' '}
                {t('auth.account.support_suffix')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
