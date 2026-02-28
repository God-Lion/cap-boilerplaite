import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material'
import {
  NavigateNext as NavigateNextIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Language as GlobeIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Path from '../path'

const APITokenDetails: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { tokenId } = useParams<{ tokenId: string }>()

  // Mock token data
  const token = {
    id: tokenId || '1',
    name: 'Production - Backend API',
    keyPrefix: 'cap_live_...',
    status: 'active',
    createdAt: '2025-10-12T14:30:00Z',
    expiresAt: '2026-10-12T14:30:00Z',
    lastUsedAt: '2026-02-14T09:15:00Z',
    lastUsedIp: '185.122.45.10',
    scopes: ['read:users', 'write:users', 'read:roles', 'read:config'],
    ipRestrictions: ['185.122.45.10', '185.122.45.11'],
  }

  const usageHistory = [
    {
      id: '1',
      timestamp: '2026-02-14T09:15:00Z',
      action: 'List Users',
      ip: '185.122.45.10',
      status: 'success',
    },
    {
      id: '2',
      timestamp: '2026-02-14T08:30:00Z',
      action: 'Get Role',
      ip: '185.122.45.10',
      status: 'success',
    },
    {
      id: '3',
      timestamp: '2026-02-13T16:00:00Z',
      action: 'Update User',
      ip: '185.122.45.11',
      status: 'success',
    },
    {
      id: '4',
      timestamp: '2026-02-13T15:45:00Z',
      action: 'Get Profile',
      ip: '185.122.45.10',
      status: 'success',
    },
  ]

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} sx={{ mb: 3 }}>
        <Link
          underline='hover'
          color='inherit'
          onClick={() => navigate(Path.apiTokens.dashboard)}
          sx={{ cursor: 'pointer' }}
        >
          {t('api_tokens:title', 'API Tokens')}
        </Link>
        <Typography color='text.primary'>
          {t('api_tokens:details_title', 'Token Details')}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant='h4' fontWeight='bold'>
            {token.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
            <Chip
              label={token.status.toUpperCase()}
              color='success'
              size='small'
              sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
            />
            <Typography variant='body2' color='text.secondary'>
              ID: {token.id}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='outlined'
            startIcon={<EditIcon />}
            onClick={() => navigate(Path.apiTokens.actions.replace(':tokenId', token.id))}
          >
            {t('common:edit', 'Edit')}
          </Button>
          <Button variant='outlined' color='error' startIcon={<DeleteIcon />}>
            {t('common:revoke', 'Revoke')}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Metadata */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                {t('api_tokens:overview', 'Overview')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' color='text.secondary' display='block'>
                  {t('api_tokens:key_prefix', 'Key Prefix')}
                </Typography>
                <Typography variant='body2' fontWeight='medium'>
                  <code>{token.keyPrefix}</code>
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' color='text.secondary' display='block'>
                  {t('api_tokens:created_at', 'Created At')}
                </Typography>
                <Typography variant='body2'>
                  {new Date(token.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' color='text.secondary' display='block'>
                  {t('api_tokens:expires_at', 'Expires At')}
                </Typography>
                <Typography variant='body2'>
                  {new Date(token.expiresAt).toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant='caption' color='text.secondary' display='block'>
                  {t('api_tokens:last_used', 'Last Used')}
                </Typography>
                <Typography variant='body2'>
                  {new Date(token.lastUsedAt).toLocaleString()}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  IP: {token.lastUsedIp}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card variant='outlined' sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                {t('api_tokens:ip_restrictions', 'IP Restrictions')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {token.ipRestrictions.map((ip) => (
                  <Chip
                    key={ip}
                    icon={<GlobeIcon fontSize='small' />}
                    label={ip}
                    variant='outlined'
                    size='small'
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Scopes & History */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant='outlined' sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                {t('api_tokens:permissions', 'Permissions & Scopes')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {token.scopes.map((scope) => (
                  <Chip key={scope} label={scope} color='primary' variant='outlined' size='small' />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card variant='outlined' sx={{ borderRadius: 3 }}>
            <Box
              sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant='subtitle1' fontWeight='bold'>
                {t('api_tokens:usage_history', 'Recent Usage History')}
              </Typography>
              <IconButton size='small'>
                <RefreshIcon fontSize='small' />
              </IconButton>
            </Box>
            <TableContainer component={Paper} elevation={0}>
              <Table size='small'>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('common:timestamp', 'Timestamp')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('common:action', 'Action')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('common:ip_address', 'IP Address')}
                    </TableCell>
                    <TableCell align='right'>{t('common:status', 'Status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usageHistory.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{entry.action}</TableCell>
                      <TableCell>{entry.ip}</TableCell>
                      <TableCell align='right'>
                        <Chip
                          label={entry.status.toUpperCase()}
                          size='small'
                          color='success'
                          variant='outlined'
                          sx={{ fontSize: '0.6rem', height: 18, fontWeight: 'bold' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button size='small' startIcon={<HistoryIcon />}>
                {t('common:view_full_history', 'View Full History')}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default APITokenDetails
