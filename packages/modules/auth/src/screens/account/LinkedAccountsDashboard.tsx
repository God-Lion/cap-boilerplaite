import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Container,
  Paper,
  IconButton,
} from '@mui/material'
import {
  Google,
  GitHub,
  Microsoft,
  Twitter,
  CheckCircle,
  History,
  Warning,
  Security,
  Link,
  ChevronRight,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

const LinkedAccountsDashboard = () => {
  const { t } = useTranslation()

  const providers = [
    {
      id: 'google',
      name: 'Google',
      icon: <Google sx={{ color: '#EA4335' }} />,
      connected: false,
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <GitHub sx={{ color: '#333' }} />,
      connected: true,
      details: {
        method: 'OAuth 2.0',
        permissions: [
          'Read your public profile info',
          'List your public repositories',
          'Verify your primary email address',
        ],
        recentActivity: [
          { date: 'Oct 12, 2024', action: 'Authorized' },
          { date: 'Dec 05, 2024', action: 'Login' },
        ],
      },
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: <Microsoft sx={{ color: '#00A4EF' }} />,
      connected: false,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter sx={{ color: '#1DA1F2' }} />,
      connected: false,
    },
  ]

  const connectedProvider = providers.find((p) => p.connected && p.id === 'github')

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          {t('auth.account.linked_accounts_title', 'Linked Accounts')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {t(
            'auth.account.linked_accounts_desc',
            'Manage your connected experiences. Securely link third-party providers to simplify your login and access shared resources.',
          )}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Providers List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant='outlined' sx={{ borderRadius: 2 }}>
            <List disablePadding>
              {providers.map((provider, index) => (
                <React.Fragment key={provider.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge='end'>
                        <ChevronRight />
                      </IconButton>
                    }
                    sx={{
                      py: 2,
                      bgcolor: provider.connected ? 'action.selected' : 'transparent',
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {provider.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={provider.name}
                      secondary={
                        provider.connected
                          ? t('auth.account.connected', 'Connected')
                          : t('auth.account.not_connected', 'Not Connected')
                      }
                    />
                  </ListItem>
                  {index < providers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Selected Provider Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          {connectedProvider && (
            <Card variant='outlined' sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      mr: 2,
                    }}
                  >
                    {connectedProvider.icon}
                  </Avatar>
                  <Box>
                    <Typography variant='h6' fontWeight='bold'>
                      {connectedProvider.name} Details
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Connected via {connectedProvider.details?.method}
                    </Typography>
                  </Box>
                  <Chip
                    label='Primary'
                    color='primary'
                    size='small'
                    sx={{ ml: 'auto', fontWeight: 'bold' }}
                  />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography
                  variant='subtitle1'
                  fontWeight='600'
                  sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                >
                  <Security sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                  Granted Permissions
                </Typography>
                <List dense>
                  {connectedProvider.details?.permissions.map((permission, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary={permission} />
                    </ListItem>
                  ))}
                </List>

                <Typography
                  variant='subtitle1'
                  fontWeight='600'
                  sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 2 }}
                >
                  <History sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                  Recent Activity
                </Typography>
                <List dense>
                  {connectedProvider.details?.recentActivity.map((activity, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemText
                        primary={activity.action}
                        secondary={activity.date}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: '500' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    bgcolor: 'error.lighter',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'error.light',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    color='error.main'
                    fontWeight='bold'
                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  >
                    <Warning sx={{ mr: 1, fontSize: 20 }} />
                    Danger Zone
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 2 }}>
                    Revoking access will prevent you from logging in with {connectedProvider.name}{' '}
                    and stop any active data sync.
                  </Typography>
                  <Button
                    variant='contained'
                    color='error'
                    disableElevation
                    sx={{ textTransform: 'none' }}
                  >
                    Revoke Access
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default LinkedAccountsDashboard
