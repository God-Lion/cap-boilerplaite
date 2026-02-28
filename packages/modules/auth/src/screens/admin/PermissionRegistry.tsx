import React, { useMemo } from 'react'
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
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Stack,
  Tooltip,
  Avatar,
} from '@mui/material'
import {
  Search,
  Add,
  Shield,
  VpnKey,
  Info,
  Layers,
  Code,
  Group,
  Business,
  Settings,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import { usePermissions } from '../../hooks/useAdminQuery'
import { Permission } from '../../services/adminService'

export default function PermissionRegistry() {
  const { t } = useTranslation('common')
  const theme = useTheme()
  const { data: permissionsResponse, isLoading } = usePermissions()
  const permissions = permissionsResponse?.data || []

  // Group by resource or custom logic if category isn't in backend
  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    permissions.forEach((p) => {
      const cat = p.resource || 'General'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).map(([label, count]) => ({
      label,
      count,
      icon: label === 'user' ? <Group /> : label === 'org' ? <Business /> : <Shield />,
    }))
  }, [permissions])

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, mb: 1 }}>
            {t('auth.admin.permission_registry')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t('auth.admin.permission_registry_subtitle')}
          </Typography>
        </Box>
        <Button variant='contained' startIcon={<Add />} sx={{ borderRadius: 2, fontWeight: 700 }}>
          {t('auth.admin.define_new_action')}
        </Button>
      </Box>

      {/* Categories Horizontal Scroll */}
      <Stack direction='row' spacing={2} sx={{ mb: 4, overflowX: 'auto', pb: 1 }}>
        {categories.map((cat, idx) => (
          <Card
            key={idx}
            sx={{
              minWidth: 200,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  width: 40,
                  height: 40,
                }}
              >
                {cat.icon}
              </Avatar>
              <Box>
                <Typography variant='body2' sx={{ fontWeight: 800 }}>
                  {cat.label}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {cat.count} Actions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Paper
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px 16px 0 0',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextField
          placeholder='Filter permission slugs or resources...'
          size='small'
          sx={{ width: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Button startIcon={<Layers />} sx={{ fontWeight: 700 }}>
          {t('auth.admin.export_json')}
        </Button>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '0 0 16px 16px',
          boxShadow: 'none',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.action_slug')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.resource')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.guard')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.description')}</TableCell>
              <TableCell align='right' sx={{ fontWeight: 700 }}>
                {t('auth.common.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.common.loading')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.common.no_results')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((perm) => (
                <TableRow key={perm.id} hover>
                  <TableCell>
                    <Chip
                      label={perm.name}
                      size='small'
                      icon={<VpnKey sx={{ fontSize: '12px !important' }} />}
                      sx={{ fontWeight: 800, fontFamily: 'monospace', borderRadius: 1.5 }}
                      color='primary'
                      variant='outlined'
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {perm.resource || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={perm.guard_name}
                      size='small'
                      variant='outlined'
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {perm.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
                      <Tooltip title='Edit Definition'>
                        <IconButton size='small'>
                          <Settings fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <IconButton size='small'>
                        <Info fontSize='small' />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
