import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link,
  Tooltip,
  useTheme,
  Grid,
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  NavigateNext as NavigateNextIcon,
  VpnKey as KeyIcon,
  Security as SecurityIcon,
  Timer as TimerIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from '../path'

interface APIToken {
  id: string
  name: string
  keyPrefix: string
  createdAt: string
  lastUsedAt: string | null
  status: 'active' | 'revoked' | 'expired'
  scopes: string[]
}

const APITokensDashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')

  // Placeholder data for UI - will be replaced with real data fetching
  const [tokens] = useState<APIToken[]>([
    {
      id: '1',
      name: 'Production - Backend API',
      keyPrefix: 'cap_live_...',
      createdAt: '2025-10-12T14:30:00Z',
      lastUsedAt: '2026-02-14T09:15:00Z',
      status: 'active',
      scopes: ['read:users', 'write:users', 'read:roles'],
    },
    {
      id: '2',
      name: 'Development - Frontend CLI',
      keyPrefix: 'cap_test_...',
      createdAt: '2026-01-20T10:00:00Z',
      lastUsedAt: '2026-02-15T15:45:00Z',
      status: 'active',
      scopes: ['read:config'],
    },
    {
      id: '3',
      name: 'Staging - Automation Bot',
      keyPrefix: 'cap_stg_...',
      createdAt: '2026-02-01T08:00:00Z',
      lastUsedAt: null,
      status: 'revoked',
      scopes: ['all'],
    },
  ])

  const getStatusColor = (status: APIToken['status']) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'revoked':
        return 'error'
      case 'expired':
        return 'warning'
      default:
        return 'default'
    }
  }

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} sx={{ mb: 3 }}>
        <Link underline='hover' color='inherit' href='/auth/account/overview'>
          {t('account:overview')}
        </Link>
        <Typography color='text.primary'>{t('api_tokens:title')}</Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' fontWeight='bold' gutterBottom>
            {t('api_tokens:dashboard_title', 'API Tokens Management')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t(
              'api_tokens:dashboard_subtitle',
              'Manage and monitor your API access tokens securely.',
            )}
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => navigate(Path.apiTokens.create_basic)}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          {t('api_tokens:create_new_token', 'Create New Token')}
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <KeyIcon color='primary' sx={{ mr: 1 }} />
                <Typography variant='subtitle2' color='text.secondary'>
                  {t('api_tokens:total_active', 'Active Tokens')}
                </Typography>
              </Box>
              <Typography variant='h4' fontWeight='bold'>
                {tokens.filter((t) => t.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimerIcon color='warning' sx={{ mr: 1 }} />
                <Typography variant='subtitle2' color='text.secondary'>
                  {t('api_tokens:expiring_soon', 'Expiring Soon')}
                </Typography>
              </Box>
              <Typography variant='h4' fontWeight='bold'>
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon color='info' sx={{ mr: 1 }} />
                <Typography variant='subtitle2' color='text.secondary'>
                  {t('api_tokens:security_status', 'Security Status')}
                </Typography>
              </Box>
              <Typography variant='h4' fontWeight='bold' color='success.main'>
                {t('api_tokens:healthy', 'Healthy')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Card */}
      <Card variant='outlined' sx={{ borderRadius: 3, pt: 2 }}>
        <Box
          sx={{
            px: 3,
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TextField
            size='small'
            placeholder={t('api_tokens:search_placeholder', 'Search tokens...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {t('api_tokens:header_name', 'Token Name')}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {t('api_tokens:header_prefix', 'Key Prefix')}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {t('api_tokens:header_status', 'Status')}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {t('api_tokens:header_created', 'Created On')}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {t('api_tokens:header_last_used', 'Last Used')}
                </TableCell>
                <TableCell align='right'>{t('api_tokens:header_actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTokens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center' sx={{ py: 4 }}>
                    <Typography color='text.secondary'>
                      {t('api_tokens:no_tokens_found', 'No tokens found matching your search.')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTokens.map((token) => (
                  <TableRow key={token.id} hover>
                    <TableCell>
                      <Typography variant='body2' fontWeight='medium'>
                        {token.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        {token.scopes.slice(0, 2).map((scope) => (
                          <Chip
                            key={scope}
                            label={scope}
                            size='small'
                            variant='outlined'
                            sx={{ fontSize: '0.65rem', height: 20 }}
                          />
                        ))}
                        {token.scopes.length > 2 && (
                          <Chip
                            label={`+${token.scopes.length - 2}`}
                            size='small'
                            variant='outlined'
                            sx={{ fontSize: '0.65rem', height: 20 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <code>{token.keyPrefix}</code>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={token.status.toUpperCase()}
                        color={getStatusColor(token.status)}
                        size='small'
                        sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>{new Date(token.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {token.lastUsedAt
                        ? new Date(token.lastUsedAt).toLocaleString()
                        : t('api_tokens:never', 'Never')}
                    </TableCell>
                    <TableCell align='right'>
                      <Tooltip title={t('common:view_details')}>
                        <IconButton
                          size='small'
                          onClick={() =>
                            navigate(Path.apiTokens.details.replace(':tokenId', token.id))
                          }
                        >
                          <ViewIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common:copy_prefix')}>
                        <IconButton size='small'>
                          <CopyIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <IconButton size='small'>
                        <MoreVertIcon fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Security Tip Banner */}
      <Box
        sx={{
          mt: 4,
          p: 2,
          bgcolor: 'info.lighter',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'info.main',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SecurityIcon color='info' sx={{ mr: 2 }} />
        <Box>
          <Typography variant='subtitle2' color='info.contrastText'>
            {t('api_tokens:security_tip_title', 'Security Tip')}
          </Typography>
          <Typography variant='body2' color='info.contrastText'>
            {t(
              'api_tokens:security_tip_message',
              'Rotate your API tokens regularly and restrict them to specific IP addresses for maximum security.',
            )}
          </Typography>
        </Box>
        <Button
          size='small'
          onClick={() => navigate(Path.apiTokens.security_warning)}
          sx={{ ml: 'auto', fontWeight: 'bold' }}
        >
          {t('common:learn_more', 'Learn More')}
        </Button>
      </Box>
    </Box>
  )
}

export default APITokensDashboard
