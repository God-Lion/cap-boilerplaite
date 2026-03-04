import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  History,
  Search,
  FilterList,
  GetApp,
  Security,
  ArrowForward,
  MoreVert,
  Info,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useImpersonationLogs } from '../../hooks/useAdminQuery'

export default function ImpersonationLogs() {
  const { t } = useTranslation('common')
  const theme = useTheme()
  const [search, setSearch] = useState('')
  const { data, isLoading, isError } = useImpersonationLogs({ limit: 100 })

  const [oneHourAgo] = useState(() => Date.now() - 3600_000)
  const rawLogs: any[] = data?.data?.data ?? []
  const logs = search
    ? rawLogs.filter((l) => JSON.stringify(l).toLowerCase().includes(search.toLowerCase()))
    : rawLogs

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, letterSpacing: '-0.027em', mb: 1 }}>
            {t('auth.admin.impersonationLogsTitle')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t('auth.admin.impersonationLogsSubtitle')}
          </Typography>
        </Box>
        <Button
          variant='outlined'
          startIcon={<GetApp />}
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={() => {
            if (!rawLogs.length) return
            const csv = [
              ['ID', 'Action', 'Admin ID', 'Target User ID', 'Reason', 'IP', 'Date'].join(','),
              ...rawLogs.map((l) =>
                [
                  l.id,
                  l.action,
                  l.impersonatedBy ?? '',
                  l.userId ?? '',
                  `"${(l.metadata?.reason ?? '').replace(/"/g, '""')}"`,
                  l.ipAddress ?? '',
                  `"${new Date(l.createdAt).toLocaleString()}"`,
                ].join(','),
              ),
            ].join('\n')
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `impersonation-logs-${new Date().toISOString().split('T')[0]}.csv`
            a.click()
          }}
          disabled={rawLogs.length === 0}
        >
          {t('auth.common.export')}
        </Button>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: t('auth.admin.statTotalSessions'),
            value: rawLogs.length || '…',
            icon: <History />,
            color: 'primary',
          },
          {
            label: t('auth.admin.statActiveSessions'),
            value:
              rawLogs.filter((l) => !l.createdAt || new Date(l.createdAt).getTime() > oneHourAgo)
                .length || 0,
            icon: <Security />,
            color: 'success',
          },
          { label: t('auth.admin.statFlagsRaised'), value: 0, icon: <Info />, color: 'info' },
        ].map((stat, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha((theme.palette as any)[stat.color].main, 0.1),
                    color: (theme.palette as any)[stat.color].main,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 700, textTransform: 'uppercase' }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography variant='h5' sx={{ fontWeight: 800 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter / Search Bar */}
      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <CardContent sx={{ p: '12px !important' }}>
          <Stack direction='row' spacing={2}>
            <TextField
              placeholder={t('auth.admin.searchLogs')}
              size='small'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search fontSize='small' sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant='text'
              startIcon={<FilterList />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {t('auth.common.filters')}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.idRef')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.administrator')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align='center'>
                <ArrowForward fontSize='small' color='action' />
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.user')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.timestamp')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.reason')}</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                  <Alert severity='error'>{t('auth.admin.loadImpersonationFailed')}</Alert>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center' sx={{ py: 6, color: 'text.secondary' }}>
                  {t('auth.admin.noImpersonationLogs')}
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log: any) => (
                <TableRow
                  key={log.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      #{log.id}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {log.ipAddress ?? 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}
                      >
                        {log.impersonatedBy ?? '?'}
                      </Avatar>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        Admin #{log.impersonatedBy ?? 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <ArrowForward fontSize='small' sx={{ color: 'divider' }} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '0.75rem',
                          bgcolor: 'secondary.main',
                        }}
                      >
                        {log.userId ?? '?'}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          User #{log.userId ?? 'N/A'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {log.user?.email ?? ''}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {log.metadata?.reason ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Tooltip title={t('auth.admin.viewDetails')}>
                      <IconButton size='small'>
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Security Disclaimer */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          gap: 2,
        }}
      >
        <Security color='disabled' />
        <Box>
          <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 0.5 }}>
            {t('auth.admin.immutableTrail')}
          </Typography>
          <Typography variant='caption' color='text.secondary' display='block'>
            {t('auth.admin.auditTrailDesc')}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}


