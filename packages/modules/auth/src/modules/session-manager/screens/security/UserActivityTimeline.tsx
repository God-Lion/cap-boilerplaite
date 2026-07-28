
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import { Login, VpnKey, Security, Password, NotificationImportant, History } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const UserActivityTimeline = () => {
  const { t } = useTranslation()

  const activities = [
    {
      id: '1',
      type: 'login_success',
      title: 'Successful Login',
      description: 'User logged in successfully via web portal.',
      date: 'Oct 12, 2024',
      time: '10:45 AM',
      icon: <Login fontSize='small' />,
      color: 'success',
    },
    {
      id: '2',
      type: 'token_created',
      title: 'API Token Created',
      description: 'New API token generated for external integration.',
      date: 'Oct 14, 2024',
      time: '02:30 PM',
      icon: <VpnKey fontSize='small' />,
      color: 'primary',
    },
    {
      id: '3',
      type: 'mfa_enabled',
      title: 'MFA Method Added',
      description: 'User enabled multi-factor authentication.',
      date: 'Oct 15, 2024',
      time: '09:15 AM',
      icon: <Security fontSize='small' />,
      color: 'info',
    },
    {
      id: '4',
      type: 'password_changed',
      title: 'Password Changed',
      description: 'Password update initiated by user.',
      date: 'Dec 03, 2024',
      time: '04:20 PM',
      icon: <Password fontSize='small' />,
      color: 'warning',
    },
    {
      id: '5',
      type: 'login_failed',
      title: 'Login Failed',
      description: 'Attempted login with invalid credentials.',
      date: 'Dec 05, 2024',
      time: '11:10 PM',
      icon: <NotificationImportant fontSize='small' />,
      color: 'error',
    },
  ]

  return (
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant='h4'
          fontWeight='bold'
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <History sx={{ mr: 2, fontSize: 36, color: 'primary.main' }} />
          {t('auth.account.activity_timeline_title', 'Activity Timeline')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {t(
            'auth.account.activity_timeline_desc',
            'Chronological feed of login events, security changes, and profile updates to help you monitor your account security.',
          )}
        </Typography>
      </Box>

      <Paper variant='outlined' sx={{ p: 4, borderRadius: 3 }}>
        <Timeline position='alternate'>
          {activities.map((activity, index) => (
            <TimelineItem key={activity.id}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align={index % 2 === 0 ? 'right' : 'left'}
                variant='body2'
                color='text.secondary'
              >
                <Typography variant='subtitle2' fontWeight='bold'>
                  {activity.date}
                </Typography>
                <Typography variant='caption'>{activity.time}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color={activity.color as any}>{activity.icon}</TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) => theme.shadows[2],
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <Typography variant='subtitle1' fontWeight='bold'>
                    {activity.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {activity.description}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant='text' color='primary' sx={{ textTransform: 'none', fontWeight: 'bold' }}>
          Load older activity
        </Button>
      </Box>
    </Container>
  )
}

export default UserActivityTimeline
