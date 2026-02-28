import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Container,
  Paper,
  Stack,
} from '@mui/material'
import {
  Shield,
  VpnKey,
  Security,
  Link,
  History,
  Devices,
  CheckCircle,
  Login,
  Password,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const UserSecurityStatus = () => {
  const { t } = useTranslation()

  const user = {
    name: 'John Doe',
    role: 'User',
  }

  const stats = [
    { label: 'Passkeys', count: 2, icon: <VpnKey /> },
    { label: 'API Tokens', count: 5, icon: <Security /> },
    { label: 'Linked Accounts', count: 1, icon: <Link /> },
  ]

  const activities = [
    {
      action: 'Successful login from New York, US',
      time: '2 hours ago',
      ip: '192.168.1.1',
      icon: <Login sx={{ fontSize: 20 }} />,
    },
    {
      action: 'Password changed',
      time: '24 days ago',
      icon: <Password sx={{ fontSize: 20 }} />,
    },
  ]

  const devices = [
    {
      name: 'MacBook Pro 16"',
      meta: 'Chrome • Current Session',
      status: 'active',
    },
    {
      name: 'iPhone 14 Pro',
      meta: 'Safari • Active 2h ago',
      status: 'idle',
    },
  ]

  return (
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          {t('auth.account.security_status_title', 'User Security Status')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {t(
            'auth.account.security_status_desc',
            `Manage authentication methods, sessions, and review security health for ${user.name}.`,
          )}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Security Overview */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            variant='outlined'
            sx={{
              borderRadius: 3,
              height: '100%',
              bgcolor: 'success.light',
              borderColor: 'success.main',
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'success.main',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: (theme) => `0 4px 12px ${theme.palette.success.main}44`,
                }}
              >
                <Shield sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant='h5' fontWeight='bold' color='success.dark' gutterBottom>
                {t('auth.account.excellent', 'Excellent')}
              </Typography>
              <Typography variant='body2' color='success.dark' sx={{ mb: 4 }}>
                {t(
                  'auth.account.security_status_message',
                  'This user has strong security settings enabled.',
                )}
              </Typography>

              <Grid container spacing={2}>
                {stats.map((stat, i) => (
                  <Grid key={i} size={{ xs: 4 }}>
                    <Paper
                      variant='outlined'
                      sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}
                    >
                      <Box sx={{ color: 'text.secondary', mb: 1 }}>{stat.icon}</Box>
                      <Typography variant='h6' fontWeight='bold'>
                        {stat.count}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity & Devices */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            <Card variant='outlined' sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant='subtitle1'
                  fontWeight='bold'
                  sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <History sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                  {t('auth.account.recent_activity', 'Recent Activity')}
                </Typography>
                <List dense disablePadding>
                  {activities.map((activity, i) => (
                    <React.Fragment key={i}>
                      <ListItem disableGutters sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'action.hover',
                              color: 'text.secondary',
                            }}
                          >
                            {activity.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.action}
                          secondary={
                            <Typography variant='caption' color='text.secondary'>
                              {activity.time} {activity.ip ? `• IP: ${activity.ip}` : ''}
                            </Typography>
                          }
                          primaryTypographyProps={{ variant: 'body2', fontWeight: '500' }}
                        />
                      </ListItem>
                      {i < activities.length - 1 && <Divider component='li' sx={{ ml: 5 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card variant='outlined' sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant='subtitle1'
                  fontWeight='bold'
                  sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <Devices sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                  {t('auth.account.device_management', 'Device Management')}
                </Typography>
                <Grid container spacing={2}>
                  {devices.map((device, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6 }}>
                      <Paper variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant='subtitle2' fontWeight='bold'>
                          {device.name}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          display='block'
                          sx={{ mb: 1 }}
                        >
                          {device.meta}
                        </Typography>
                        <Chip
                          label={device.status === 'active' ? 'Current' : 'Authorized'}
                          size='small'
                          color={device.status === 'active' ? 'primary' : 'default'}
                          variant={device.status === 'active' ? 'filled' : 'outlined'}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserSecurityStatus
