import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  Paper,
} from '@mui/material'
import {
  Search,
  FilterList,
  Circle,
  Login,
  VpnKey,
  Block,
  Security,
  GppGood,
  Info,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function AuthEventsMonitor() {
  const { t } = useTranslation('common')
  const theme = useTheme()

  const events = [
    {
      id: '1',
      type: 'login_success',
      user: 'john.doe@example.com',
      ip: '192.168.1.1',
      location: 'New York, US',
      timestamp: '2023-10-27 14:30:12',
      severity: 'info',
    },
    {
      id: '2',
      type: 'mfa_failed',
      user: 'alice@company.com',
      ip: '203.0.113.42',
      location: 'Berlin, DE',
      timestamp: '2023-10-27 14:28:45',
      severity: 'warning',
    },
    {
      id: '3',
      type: 'account_locked',
      user: 'bob.security@vault.com',
      ip: '45.12.98.122',
      location: 'Unknown',
      timestamp: '2023-10-27 14:25:00',
      severity: 'error',
    },
    {
      id: '4',
      type: 'password_changed',
      user: 'sarah.k@web.com',
      ip: '88.132.4.55',
      location: 'London, UK',
      timestamp: '2023-10-27 14:20:33',
      severity: 'info',
    },
    {
      id: '5',
      type: 'impersonation_start',
      user: 'admin@system.com',
      ip: '10.0.0.5',
      location: 'Internal',
      timestamp: '2023-10-27 14:15:22',
      severity: 'warning',
    },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_success':
        return <Login sx={{ color: 'success.main', fontSize: 18 }} />
      case 'mfa_failed':
        return <Security sx={{ color: 'warning.main', fontSize: 18 }} />
      case 'account_locked':
        return <Block sx={{ color: 'error.main', fontSize: 18 }} />
      case 'password_changed':
        return <VpnKey sx={{ color: 'info.main', fontSize: 18 }} />
      case 'impersonation_start':
        return <GppGood sx={{ color: 'warning.main', fontSize: 18 }} />
      default:
        return <Circle sx={{ color: 'action.active', fontSize: 18 }} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'info'
      case 'warning':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, letterSpacing: '-0.027em', mb: 1 }}>
            {t('auth.admin.eventsMonitor')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t('auth.admin.eventsMonitor_subtitle')}
          </Typography>
        </Box>
        <Stack direction='row' spacing={1}>
          <Tooltip title='Pause Stream'>
            <Chip
              label='Live'
              color='success'
              size='small'
              onDelete={() => {}}
              deleteIcon={
                <Circle sx={{ animation: 'pulse 1.5s infinite', fontSize: '10px !important' }} />
              }
              sx={{ fontWeight: 800, px: 1 }}
            />
          </Tooltip>
        </Stack>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              size='small'
              placeholder={t('auth.admin.searchEventsPlaceholder')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search fontSize='small' color='action' />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { sm: 400 } }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button
              startIcon={<FilterList fontSize='small' />}
              size='small'
              sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
            >
              {t('auth.common.filters')}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Events Table */}
      <TableContainer
        component={Paper}
        variant='outlined'
        sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                {t('auth.admin.colEventType')}
              </TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                {t('auth.admin.colSubjectUser')}
              </TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                {t('auth.admin.colSourceIp')}
              </TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                {t('auth.common.timestamp')}
              </TableCell>
              <TableCell
                sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}
                align='right'
              >
                {t('auth.admin.colSeverity')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow
                key={event.id}
                hover
                sx={{
                  '& td': {
                    borderBottom: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.5),
                  },
                }}
              >
                <TableCell>
                  <Stack direction='row' spacing={1.5} alignItems='center'>
                    {getEventIcon(event.type)}
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      {event.type.replace('_', ' ')}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant='body2' sx={{ fontWeight: 500 }}>
                    {event.user}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {event.ip}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {event.location}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontFamily: 'monospace' }}
                  >
                    {event.timestamp}
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Chip
                    label={event.severity}
                    size='small'
                    color={getSeverityColor(event.severity) as any}
                    variant='outlined'
                    sx={{
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      fontSize: '0.6rem',
                      height: 18,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Info fontSize='inherit' sx={{ mr: 0.5 }} />{' '}
          {t('auth.admin.eventsCountFooter', { count: 50 })}
        </Typography>
      </Box>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `,
        }}
      />
    </Box>
  )
}

