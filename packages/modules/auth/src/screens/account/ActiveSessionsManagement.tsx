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
  Alert,
  AlertTitle,
  Tooltip,
  Stack,
} from '@mui/material'
import {
  Computer,
  Smartphone,
  Laptop,
  Tablet,
  LocationOn,
  Security,
  ArrowForward,
  DeleteOutline,
  InfoOutlined,
  Fingerprint,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from './path'

interface ActiveSessionsProps {
  adminView?: boolean
  userName?: string
  userId?: string
}

const ActiveSessionsManagement = ({ adminView, userName, userId }: ActiveSessionsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const currentSession = {
    device: 'Windows 11 PC',
    browser: 'Chrome Browser',
    type: 'desktop',
    current: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    fingerprint: 'fp_8291_ax92',
  }

  const otherSessions = [
    {
      id: '1',
      device: 'iPhone 13 Pro',
      subtitle: 'Safari on iOS 16',
      location: 'London, UK',
      ip: '203.0.113.195',
      type: 'mobile',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)...',
      fingerprint: 'fp_1122_bd44',
    },
    {
      id: '2',
      device: 'MacBook Pro 16"',
      subtitle: 'Firefox Browser',
      location: 'New York, USA',
      ip: '198.51.100.24',
      type: 'laptop',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0)...',
      fingerprint: 'fp_5566_cc77',
    },
  ]

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return <Computer />
      case 'mobile':
        return <Smartphone />
      case 'laptop':
        return <Laptop />
      case 'tablet':
        return <Tablet />
      default:
        return <Computer />
    }
  }

  return (
    <Container maxWidth='lg' sx={{ py: adminView ? 0 : 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          {adminView
            ? t('auth.admin.investigate_sessions', 'Investigate Sessions')
            : t('auth.account.active_sessions_title', 'Active Sessions')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {adminView
            ? t(
                'auth.admin.investigate_desc',
                'Detailed technical breakdown of all active security contexts for user {{name}}.',
                { name: userName || userId },
              )
            : t(
                'auth.account.active_sessions_desc',
                "View and manage the devices where you're currently signed in. If you see a device you don't recognize, revoke access immediately.",
              )}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: adminView ? 12 : 8 }}>
          {/* Current Session */}
          {!adminView && (
            <>
              <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>
                {t('auth.account.current_session', 'Current Session')}
              </Typography>
              <Card
                variant='outlined'
                sx={{
                  borderRadius: 2,
                  mb: 4,
                  bgcolor: 'primary.lighter',
                  borderColor: 'primary.light',
                }}
              >
                <CardContent>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        {getDeviceIcon(currentSession.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={currentSession.device}
                      secondary={currentSession.browser}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                    <Chip
                      label={t('auth.account.active_now', 'Active Now')}
                      color='primary'
                      size='small'
                    />
                  </ListItem>
                </CardContent>
              </Card>
            </>
          )}

          {/* Other Sessions */}
          <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>
            {adminView
              ? t('auth.admin.active_tokens', 'Active Access Tokens')
              : t('auth.account.other_active_sessions', 'Other Active Sessions')}
          </Typography>
          <Paper variant='outlined' sx={{ borderRadius: 2 }}>
            <List disablePadding>
              {otherSessions.map((session, index) => (
                <React.Fragment key={session.id}>
                  <ListItem
                    secondaryAction={
                      <Stack direction='row' spacing={1}>
                        {adminView && (
                          <Tooltip title='View Full User Agent'>
                            <IconButton size='small'>
                              <InfoOutlined fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Button
                          variant={adminView ? 'outlined' : 'text'}
                          color='error'
                          size='small'
                          startIcon={<DeleteOutline />}
                          sx={{ textTransform: 'none' }}
                        >
                          {t('auth.account.revoke', 'Revoke')}
                        </Button>
                      </Stack>
                    }
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: 'action.hover',
                          color: 'text.secondary',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {getDeviceIcon(session.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Typography variant='subtitle2' fontWeight={700}>
                            {session.device}
                          </Typography>
                          {adminView && (
                            <Chip
                              label={session.fingerprint}
                              size='small'
                              variant='outlined'
                              icon={<Fingerprint sx={{ fontSize: '0.8rem !important' }} />}
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Box component='span' sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant='body2' color='text.secondary'>
                            {session.subtitle}
                          </Typography>
                          <Box
                            component='span'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 0.5,
                            }}
                          >
                            <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                            <Typography variant='caption' color='text.secondary'>
                              {session.location} • IP: {session.ip}
                            </Typography>
                          </Box>
                          {adminView && (
                            <Typography
                              variant='caption'
                              sx={{ mt: 0.5, fontStyle: 'italic', opacity: 0.7 }}
                            >
                              UA: {session.userAgent.substring(0, 60)}...
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < otherSessions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              variant='outlined'
              color='error'
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {adminView
                ? t('auth.admin.terminate_all', 'Terminate All User Sessions')
                : t('auth.account.logout_all_others', 'Log out of all other sessions')}
            </Button>
          </Box>
        </Grid>

        {!adminView && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Alert
              severity='info'
              icon={<Security color='info' />}
              sx={{
                borderRadius: 2,
                '& .MuiAlert-message': { width: '100%' },
                bgcolor: 'info.lighter',
                border: '1px solid',
                borderColor: 'info.light',
              }}
            >
              <AlertTitle sx={{ fontWeight: 'bold' }}>
                {t('auth.account.security_tip', 'Security Tip')}
              </AlertTitle>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {t(
                  'auth.account.security_tip_desc',
                  "Did you find a session you don't recognize? Revoke it and change your password to secure your account.",
                )}
              </Typography>
              <Button
                variant='text'
                size='small'
                endIcon={<ArrowForward />}
                onClick={() => navigate(Path.changePassword)}
                sx={{ textTransform: 'none', fontWeight: 'bold', p: 0 }}
              >
                {t('auth.account.change_password', 'Change Password')}
              </Button>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default ActiveSessionsManagement
