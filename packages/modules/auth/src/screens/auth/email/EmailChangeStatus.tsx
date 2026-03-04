import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material'

import { InfoOutlined, Refresh, ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function EmailChangeStatus() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Mock data for requests
  const requests = [
    {
      id: 1,
      oldEmail: 'current@example.com',
      newEmail: 'new@example.com',
      status: 'pending_authorization',
      date: '2026-02-15 10:30',
    },
    {
      id: 2,
      oldEmail: 'old@example.com',
      newEmail: 'current@example.com',
      status: 'completed',
      date: '2025-11-20 14:15',
    },
  ]

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Chip
            label={t('auth.email.status_completed', 'Completed')}
            color='success'
            size='small'
            variant='outlined'
          />
        )
      case 'pending_authorization':
        return (
          <Chip
            label={t('auth.email.status_pending', 'Pending Auth')}
            color='warning'
            size='small'
            variant='outlined'
          />
        )
      case 'expired':
        return (
          <Chip
            label={t('auth.email.status_expired', 'Expired')}
            color='error'
            size='small'
            variant='outlined'
          />
        )
      default:
        return <Chip label={status} size='small' variant='outlined' />
    }
  }

  return (
    <>
      <title>
        {t('auth.email.change_status_title', 'Email Change Status')} - {themeConfig.templateName}
      </title>

      <Container
        component='main'
        maxWidth='md'
        sx={{
          py: 8,
          minHeight: '100dvh',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Box
          sx={{
            mb: 6,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.025em' }}>
              {t('auth.email.status_heading', 'Email Management')}
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {t(
                'auth.email.status_description',
                'Track and manage your email address change requests.',
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title={t('auth.common.refresh', 'Refresh')}>
              <IconButton sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant='contained'
              onClick={() => navigate(Path.requestEmailChange)}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
            >
              {t('auth.email.new_request', 'New Request')}
            </Button>
          </Box>
        </Box>

        <Card
          sx={{
            borderRadius: '16px',
            boxShadow: (theme) => `0 10px 30px ${alpha(theme.palette.common.black, 0.05)}`,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {t('auth.email.col_emails', 'Email Addresses')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {t('auth.email.col_date', 'Date Requested')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {t('auth.email.col_status', 'Status')}
                  </TableCell>
                  <TableCell align='right' />
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {request.newEmail}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.6 }}>
                          <Typography variant='caption'>
                            {t('auth.email.from', 'from')}: {request.oldEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {request.date}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(request.status)}</TableCell>
                    <TableCell align='right'>
                      <IconButton size='small'>
                        <InfoOutlined fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Box sx={{ mt: 5 }}>
          <Button
            onClick={() => navigate(Path.team)}
            startIcon={<ArrowBack />}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            {t('auth.common.backToDashboard', 'Back to Dashboard')}
          </Button>
        </Box>
      </Container>
    </>
  )
}

