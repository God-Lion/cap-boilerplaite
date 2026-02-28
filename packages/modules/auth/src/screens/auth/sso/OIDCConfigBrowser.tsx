import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  alpha,
  useTheme,
  TextField,
  InputAdornment,
  Tooltip,
  Avatar,
} from '@mui/material'
import { Add, Edit, Delete, Search, VpnKey, ContentCopy, VerifiedUser } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function OIDCConfigBrowser() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [search, setSearch] = useState('')

  const clients = [
    {
      id: 'client_1',
      name: 'Mobile App Prod',
      clientId: 'nexus-mobile-8x92nd',
      type: 'public',
      status: 'active',
      lastUsed: '2024-05-15 10:30',
    },
    {
      id: 'client_2',
      name: 'Admin Dashboard',
      clientId: 'nexus-admin-k92lxm',
      type: 'confidential',
      status: 'active',
      lastUsed: '2024-05-15 08:45',
    },
    {
      id: 'client_3',
      name: 'Legacy Integration',
      clientId: 'nexus-legacy-v1',
      type: 'confidential',
      status: 'revoked',
      lastUsed: '2023-12-01 14:20',
    },
  ]

  return (
    <Container maxWidth='xl' sx={{ py: 6 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}
      >
        <Box>
          <Typography variant='h4' fontWeight={800} gutterBottom>
            {t('auth.sso.oidc_clients_title', 'OIDC Client Management')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t(
              'auth.sso.oidc_clients_subtitle',
              'Manage OpenID Connect clients, secrets, and redirect URIs',
            )}
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Add />}
          sx={{
            height: 48,
            borderRadius: '14px',
            px: 4,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
          }}
        >
          {t('auth.sso.create_client', 'Create New Client')}
        </Button>
      </Box>

      <Card
        sx={{
          borderRadius: '24px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.default, 0.3),
          }}
        >
          <TextField
            size='small'
            placeholder={t('common.search_clients', 'Search by name or Client ID...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', md: 400 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search fontSize='small' color='primary' />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px' },
            }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.action.hover, 0.02) }}>
                <TableCell sx={{ fontWeight: 700, py: 2.5 }}>
                  {t('auth.sso.client_name', 'Client Name')}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t('auth.sso.client_id', 'Client ID')}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('auth.sso.client_type', 'Type')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('common.status', 'Status')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t('auth.sso.last_active', 'Last Active')}
                </TableCell>
                <TableCell align='right' sx={{ fontWeight: 700 }}>
                  {t('common.actions', 'Actions')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  sx={{
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        <VpnKey sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Typography variant='subtitle2' fontWeight={600}>
                        {client.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant='body2'
                        sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                      >
                        {client.clientId}
                      </Typography>
                      <Tooltip title={t('common.copy', 'Copy')}>
                        <IconButton size='small' sx={{ p: 0.5 }}>
                          <ContentCopy sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={client.type}
                      size='small'
                      variant='outlined'
                      sx={{ borderRadius: '6px', fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={client.status}
                      size='small'
                      color={client.status === 'active' ? 'success' : 'error'}
                      sx={{ borderRadius: '6px', fontWeight: 700, fontSize: '0.65rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='caption' color='text.secondary'>
                      {client.lastUsed}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title={t('common.edit', 'Edit')}>
                        <IconButton size='small' color='primary'>
                          <Edit fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete', 'Delete')}>
                        <IconButton size='small' color='error'>
                          <Delete fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Box
        sx={{
          mt: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 3,
          borderRadius: '16px',
          backgroundColor: alpha(theme.palette.info.main, 0.05),
          border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
        }}
      >
        <VerifiedUser color='info' />
        <Box>
          <Typography variant='subtitle2' fontWeight={700} color='info.main'>
            {t('auth.sso.security_best_practice', 'Security Recommendation')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t(
              'auth.sso.client_rotation_tip',
              'Ensure you rotate client secrets every 90 days for production environments.',
            )}
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
