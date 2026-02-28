import { useMemo } from 'react'
import {
  Box,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Link as MuiLink,
} from '@mui/material'
import {
  Home,
  Shield,
  CreditCard,
  Group,
  Settings,
  Edit,
  Warning,
  Devices,
  Link as LinkIcon,
  Api,
  LockOpen,
  Login,
  Key,
  LockReset,
  Block,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from '../path'
import { useAuth } from '@cap/platform-core'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconBgColor: string
  iconColor: string
  actionText?: string
  actionColor?: string
  onActionClick?: () => void
  badge?: React.ReactNode
  progress?: number
}

interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  iconBgColor: string
  iconColor: string
}

const StatCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  actionText,
  actionColor = 'primary',
  onActionClick,
  badge,
  progress,
}: StatCardProps) => (
  <Card
    sx={{
      border: 1,
      borderColor: 'divider',
      boxShadow: 1,
      transition: 'box-shadow 0.2s',
      '&:hover': {
        boxShadow: 3,
      },
    }}
  >
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Box
          sx={{
            bgcolor: iconBgColor,
            color: iconColor,
            p: 0.75,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='h5' sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
        {badge}
      </Box>

      {progress !== undefined && (
        <LinearProgress
          variant='determinate'
          value={progress}
          sx={{
            mt: 1,
            height: 6,
            borderRadius: 3,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'primary.main',
              borderRadius: 3,
            },
          }}
        />
      )}

      {actionText && (
        <MuiLink
          component='button'
          onClick={onActionClick}
          sx={{
            fontSize: '0.75rem',
            fontWeight: 500,
            textDecoration: 'none',
            color: actionColor === 'error' ? 'error.main' : 'primary.main',
            textAlign: 'left',
            mt: 0.5,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {actionText}
        </MuiLink>
      )}
    </CardContent>
  </Card>
)

const ActivityListItem = ({ item }: { item: ActivityItem }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      gap: 2,
      p: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:hover': {
        bgcolor: 'action.hover',
      },
      '&:last-child': {
        borderBottom: 'none',
      },
      transition: 'background-color 0.2s',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Box
        sx={{
          mt: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: item.iconBgColor,
          color: item.iconColor,
          flexShrink: 0,
        }}
      >
        {item.icon}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant='body1' sx={{ fontWeight: 600 }}>
          {item.title}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.875rem' }}>
          {item.description}
        </Typography>
      </Box>
    </Box>
    <Typography
      variant='body2'
      color='text.secondary'
      sx={{
        fontSize: '0.875rem',
        fontWeight: 500,
        textAlign: { xs: 'left', sm: 'right' },
        pl: { xs: 7, sm: 0 },
        flexShrink: 0,
      }}
    >
      {item.timestamp}
    </Typography>
  </Box>
)

export default function AccountOverview() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const { user: authUser } = useAuth()
  const user = authUser?.user || authUser

  // const { data: profileResponse, isLoading: isProfileLoading } = useProfileSettings()
  // const user = profileResponse?.data?.user

  // console.log(user)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: 'overview',
        label: t('auth.account.overview'),
        icon: <Home />,
        path: Path.account.overview,
      },
      {
        id: 'security',
        label: t('auth.account.security_section'),
        icon: <Shield />,
        path: Path.account.security,
      },
      {
        id: 'billing',
        label: t('auth.account.billing'),
        icon: <CreditCard />,
        path: Path.account.billing,
      },
      {
        id: 'team',
        label: t('auth.account.team'),
        icon: <Group />,
        path: Path.auth.team,
      },
      {
        id: 'settings',
        label: t('auth.account.settings'),
        icon: <Settings />,
        path: Path.account.settings,
      },
    ],
    [t],
  )

  const activityItems: Array<ActivityItem> = useMemo(
    () => [
      {
        id: '1',
        title: t('auth.account.activity.successful_login'),
        description: t('auth.account.activity.login_details'),
        timestamp: t('auth.account.activity.today_at', { time: new Date().toLocaleTimeString() }),
        icon: <Login />,
        iconBgColor: theme.palette.success.light,
        iconColor: theme.palette.success.main,
      },
      {
        id: '2',
        title: t('auth.account.activity.api_token_created'),
        description: t('auth.account.activity.token_details'),
        timestamp: t('auth.account.activity.yesterday_at', {
          time: new Date().toLocaleTimeString(),
        }),
        icon: <Key />,
        iconBgColor: theme.palette.primary.light,
        iconColor: theme.palette.primary.main,
      },
      {
        id: '3',
        title: t('auth.account.activity.password_changed'),
        description: t('auth.account.activity.recovery_method'),
        timestamp: t('auth.account.activity.oct_24', { time: new Date().toLocaleTimeString() }),
        icon: <LockReset />,
        iconBgColor: theme.palette.grey[200],
        iconColor: theme.palette.grey[700],
      },
      {
        id: '4',
        title: t('auth.account.activity.failed_login'),
        description: t('auth.account.activity.blocked_ip'),
        timestamp: t('auth.account.activity.oct_22', { time: new Date().toLocaleTimeString() }),
        icon: <Block />,
        iconBgColor: theme.palette.error.light,
        iconColor: theme.palette.error.main,
      },
    ],
    [t, theme],
  )

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Page Content */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 1100,
          width: '100%',
          mx: 'auto',
          p: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Page Heading */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              variant='h3'
              sx={{
                fontSize: { xs: '1.875rem', md: '2.25rem' },
                fontWeight: 900,
                letterSpacing: '-0.033em',
              }}
            >
              {t('auth.account.overview_title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ fontSize: '1rem' }}>
              {t('auth.account.overview_welcome', { name: `${user?.firstName} ${user?.lastName}` })}
            </Typography>
          </Box>
          <Button
            variant='contained'
            startIcon={<Edit />}
            onClick={() => navigate(Path.account.view)}
            sx={{
              flexShrink: 0,
              height: 40,
              px: 2,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 1,
              // bgcolor: 'grey.200',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'grey.300',
              },
            }}
          >
            {t('auth.account.edit_profile')}
          </Button>
        </Box>

        {/* Security Alert */}
        <Alert
          severity='warning'
          icon={<Warning sx={{ fontSize: 28 }} />}
          action={
            <Button
              variant='contained'
              size='small'
              onClick={() => navigate(Path.mfa.setup)}
              sx={{
                px: 2,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: 2,
                flexShrink: 0,
              }}
            >
              {t('auth.mfa.enable_2fa')}
            </Button>
          }
          sx={{
            borderRadius: 3,
            border: 1,
            borderColor: 'warning.light',
            bgcolor: 'warning.lighter',
            alignItems: 'center',
            p: 2.5,
            '& .MuiAlert-message': {
              flex: 1,
              py: 0,
            },
          }}
        >
          <Typography variant='body1' sx={{ fontWeight: 700, mb: 0.5 }}>
            {t('auth.account.security.recommendation')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t('auth.account.security.enable_2fa_message')}
          </Typography>
        </Alert>

        {/* Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          <StatCard
            title={t('auth.account.stats.active_sessions')}
            value={t('auth.account.stats.devices_count')}
            icon={<Devices sx={{ fontSize: 20 }} />}
            iconBgColor='rgba(19, 127, 236, 0.1)'
            iconColor='primary.main'
            actionText={t('auth.account.stats.manage_devices')}
            onActionClick={() => navigate(Path.account.sessions)}
          />

          <StatCard
            title={t('auth.account.stats.linked_accounts')}
            value={t('auth.account.stats.linked_count')}
            icon={<LinkIcon sx={{ fontSize: 20 }} />}
            iconBgColor='rgba(19, 127, 236, 0.1)'
            iconColor='primary.main'
            badge={
              <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                <Chip
                  label='G'
                  size='small'
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    bgcolor: 'grey.200',
                    '& .MuiChip-label': { px: 0 },
                  }}
                />
                <Chip
                  label='GH'
                  size='small'
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    bgcolor: 'grey.800',
                    color: 'white',
                    '& .MuiChip-label': { px: 0 },
                  }}
                />
              </Box>
            }
          />

          <StatCard
            title={t('auth.account.stats.api_tokens')}
            value={t('auth.account.stats.active_count')}
            icon={<Api sx={{ fontSize: 20 }} />}
            iconBgColor='rgba(19, 127, 236, 0.1)'
            iconColor='primary.main'
            progress={85}
          />

          <StatCard
            title={t('auth.account.stats.mfa_status')}
            value={t('auth.account.common.disabled')}
            icon={<LockOpen sx={{ fontSize: 20 }} />}
            iconBgColor='rgba(211, 47, 47, 0.1)'
            iconColor='error.main'
            actionText={t('auth.account.mfa.enable_now')}
            actionColor='error'
            onActionClick={() => navigate(Path.mfa.setup)}
          />
        </Box>

        {/* Recent Activity Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pt: 2,
              pb: 1,
            }}
          >
            <Typography
              variant='h5'
              sx={{
                fontSize: '1.375rem',
                fontWeight: 700,
                letterSpacing: '-0.015em',
              }}
            >
              {t('auth.account.activity.recent_feed')}
            </Typography>
            <Button
              onClick={() => navigate(Path.auth.loginHistory)}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline',
                  bgcolor: 'transparent',
                },
              }}
            >
              {t('auth.account.activity.view_full_history')}
            </Button>
          </Box>

          <Card
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 1,
            }}
          >
            {activityItems.map((item) => (
              <ActivityListItem key={item.id} item={item} />
            ))}
          </Card>
        </Box>

        {/* Bottom Spacer */}
        <Box sx={{ height: 48 }} />
      </Box>
    </Box>
  )
}
