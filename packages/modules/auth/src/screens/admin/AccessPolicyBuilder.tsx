import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Switch,
  IconButton,
  Chip,
  alpha,
  useTheme,
  Stack,
  Divider,
  Paper,
  Tooltip,
  Avatar,
} from '@mui/material'
import {
  Add,
  Delete,
  Security,
  NetworkCheck,
  Smartphone,
  Public,
  Settings,
  Shield,
  History,
  Info,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { AccessPolicy, AccessPolicyRule } from '../../types/governance.types'

const mockPolicies: AccessPolicy[] = [
  {
    id: 'POL_1',
    name: 'Block External IPs',
    description: 'Requires users to be on the corporate VPN for sensitive resource access.',
    type: 'conditional_access',
    status: 'active',
    priority: 1,
    rules: [{ id: 'R1', type: 'network_cidr', config: { range: '10.0.0.0/8' }, effect: 'allow' }],
  },
  {
    id: 'POL_2',
    name: 'MFA Enforcement',
    description: 'Always require MFA for administrative roles regardless of location.',
    type: 'login_policy',
    status: 'active',
    priority: 2,
    rules: [{ id: 'R2', type: 'mfa_required', config: { roles: ['Admin'] }, effect: 'allow' }],
  },
]

export default function AccessPolicyBuilder() {
  const { t } = useTranslation('common')
  const theme = useTheme()
  const [policies] = useState<AccessPolicy[]>(mockPolicies)

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'network_cidr':
        return <NetworkCheck />
      case 'mfa_required':
        return <Smartphone />
      case 'device_compliance':
        return <Security />
      case 'geo_location':
        return <Public />
      default:
        return <Settings />
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, mb: 1 }}>
            {t('auth.admin.access_policies')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t('auth.admin.access_policies_subtitle')}
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Add />}
          sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
        >
          {t('auth.admin.create_new_policy')}
        </Button>
      </Box>

      {/* Stats/Overview Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          border: '1px dashed',
          borderColor: alpha(theme.palette.primary.main, 0.2),
          boxShadow: 'none',
        }}
      >
        <CardContent
          sx={{
            py: 3,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction='row' spacing={4}>
            <Box>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ fontWeight: 800, textTransform: 'uppercase' }}
              >
                {t('auth.admin.active_policies')}
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 900 }}>
                12
              </Typography>
            </Box>
            <Box>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ fontWeight: 800, textTransform: 'uppercase' }}
              >
                {t('auth.admin.signals_tracked')}
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 900 }}>
                IP, Device, MFA
              </Typography>
            </Box>
            <Box>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ fontWeight: 800, textTransform: 'uppercase' }}
              >
                {t('auth.admin.last_logic_audit')}
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 900 }}>
                4 hours ago
              </Typography>
            </Box>
          </Stack>
          <Button startIcon={<History />} sx={{ textTransform: 'none', fontWeight: 700 }}>
            {t('auth.admin.view_change_logs')}
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {policies.map((policy) => (
          <Grid key={policy.id} size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.01),
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                    }}
                  >
                    <Shield />
                  </Avatar>
                  <Box>
                    <Typography variant='h6' sx={{ fontWeight: 800 }}>
                      {policy.name}
                    </Typography>
                    <Chip
                      label={policy.type.replace('_', ' ')}
                      size='small'
                      sx={{
                        height: 20,
                        fontSize: '0.625rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                      }}
                      color='primary'
                      variant='outlined'
                    />
                  </Box>
                </Stack>
                <Switch checked={policy.status === 'active'} color='primary' />
              </Box>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 3, minHeight: 40 }}>
                {policy.description}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 2 }}
                >
                  Logic Fragments
                </Typography>
                <Stack spacing={1.5}>
                  {policy.rules.map((rule: AccessPolicyRule) => (
                    <Box
                      key={rule.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.action.hover, 0.5),
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ color: 'primary.main' }}>{getRuleIcon(rule.type)}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>
                          {rule.type === 'network_cidr'
                            ? `IP Range: ${rule.config.range}`
                            : 'MFA Requirement'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Condition: {rule.effect.toUpperCase()}
                        </Typography>
                      </Box>
                      <Tooltip title='Rule Details'>
                        <IconButton size='small'>
                          <Info fontSize='inherit' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='caption' sx={{ fontWeight: 700, color: 'text.disabled' }}>
                  PRIORITY: {policy.priority}
                </Typography>
                <Stack direction='row' spacing={1}>
                  <IconButton size='small'>
                    <Settings fontSize='small' />
                  </IconButton>
                  <IconButton size='small' color='error'>
                    <Delete fontSize='small' />
                  </IconButton>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* Empty State / Add Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: '100%',
              minHeight: 300,
              borderRadius: 4,
              border: '2px dashed',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.action.hover, 0.8),
                color: 'text.secondary',
                mb: 2,
              }}
            >
              <Add />
            </Avatar>
            <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
              {t('auth.admin.define_custom_logic')}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {t('auth.admin.combine_signals_desc')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
