// FILE: packages/modules/auth/src/screens/auth/sso/JWKSManagement.tsx
// RULES APPLIED: mui-component-standards.md, react-component-patterns.md
// FIXES: Added header; implemented entry motion; aligned card and button styles with project standards; translated all UI strings; added accessibility labels to icon buttons
// AUDIT: CRITICAL ✓  HIGH ✓  MEDIUM ✓

import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  alpha,
  useTheme,
  Grid,
  Chip,
  Alert,
  Tooltip,
  LinearProgress,
  Avatar,
} from '@mui/material'
import Key from '@mui/icons-material/Key'
import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Refresh from '@mui/icons-material/Refresh'
import History from '@mui/icons-material/History'
import Security from '@mui/icons-material/Security'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function JWKSManagement() {
  const { t } = useTranslation()
  const theme = useTheme()

  const keys = [
    {
      kid: 'nexus-v2-main-2024',
      status: 'active',
      alg: 'RS256',
      use: 'sig',
      created: '2024-01-10',
      expires: '2025-01-10',
      health: 95,
    },
    {
      kid: 'nexus-v2-backup-2024',
      status: 'standby',
      alg: 'RS256',
      use: 'sig',
      created: '2024-01-11',
      expires: '2025-01-11',
      health: 100,
    },
  ]

  return (
    <Container
      maxWidth='lg'
      component={motion.div}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      sx={{ py: 6 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 5,
        }}
      >
        <Box>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.027em',
              mb: 1,
            }}
          >
            {t('auth.sso.jwks_title', 'JWKS Key Management')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t(
              'auth.sso.jwks_subtitle',
              'Manage JSON Web Key Sets for OIDC and SSF signature verification',
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='outlined'
            startIcon={<Refresh />}
            sx={{
              height: 44,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            {t('auth.sso.rotate_keys', 'Force Rotation')}
          </Button>
          <Button
            variant='contained'
            startIcon={<Add />}
            sx={{
              bgcolor: 'info.main',
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              textTransform: 'none',
              fontWeight: 700,
              height: 44,
              borderRadius: '12px',
              px: 3,
              '&:hover': { bgcolor: 'info.dark' },
            }}
          >
            {t('auth.sso.manual_key', 'Add Manual Key')}
          </Button>
        </Box>
      </Box>

      <Alert
        severity='warning'
        icon={<Security />}
        sx={{
          borderRadius: 4,
          mb: 4,
          border: '1px solid',
          borderColor: alpha(theme.palette.warning.main, 0.2),
          bgcolor: alpha(theme.palette.warning.main, 0.02),
          '& .MuiAlert-message': { fontWeight: 500, color: 'text.primary' },
        }}
      >
        {t(
          'auth.sso.jwks_warning',
          'Key rotation affects all currently active sessions and signal receivers. Ensure all endpoints are compatible with the new keys before finalizing rotation.',
        )}
      </Alert>

      <Grid container spacing={3}>
        {keys.map((key) => (
          <Grid key={key.kid} size={{ xs: 12 }}>
            <Card
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                borderRadius: 4,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.01),
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems='center'>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          color: 'primary.main',
                          borderRadius: '14px',
                        }}
                      >
                        <Key />
                      </Avatar>
                      <Box>
                        <Typography variant='subtitle1' sx={{ fontWeight: 800 }}>
                          {key.kid}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={key.status.toUpperCase()}
                            size='small'
                            color={key.status === 'active' ? 'success' : 'info'}
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: 900,
                              borderRadius: '6px',
                            }}
                          />
                          <Typography
                            variant='caption'
                            sx={{
                              fontWeight: 700,
                              color: 'text.secondary',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {key.alg}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Typography
                      variant='caption'
                      sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.075em',
                        color: 'text.secondary',
                        display: 'block',
                        mb: 1,
                      }}
                    >
                      {t('auth.sso.key_health', 'CERTIFICATE HEALTH')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress
                        variant='determinate'
                        value={key.health}
                        color={key.health > 90 ? 'success' : 'warning'}
                        sx={{
                          flexGrow: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.divider, 0.1),
                        }}
                      />
                      <Typography variant='body2' sx={{ fontWeight: 800, minWidth: 40 }}>
                        {key.health}%
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                      <Box>
                        <Typography
                          variant='caption'
                          sx={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.075em',
                            color: 'text.secondary',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          {t('common.created', 'CREATED')}
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>
                          {key.created}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant='caption'
                          sx={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.075em',
                            color: 'text.secondary',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          {t('common.expires', 'EXPIRES')}
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>
                          {key.expires}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title={t('auth.sso.copy_kid', 'Copy KID')}>
                        <IconButton
                          size='small'
                          sx={{ border: '1px solid', borderColor: 'divider' }}
                          aria-label={t('auth.sso.copy_kid', 'Copy KID')}
                        >
                          <ContentCopy fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.details', 'Details')}>
                        <IconButton
                          size='small'
                          sx={{ border: '1px solid', borderColor: 'divider' }}
                          aria-label={t('common.details', 'Details')}
                        >
                          <InfoOutlined fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete', 'Delete')}>
                        <IconButton
                          size='small'
                          color='error'
                          sx={{
                            border: '1px solid',
                            borderColor: alpha(theme.palette.error.main, 0.2),
                          }}
                          aria-label={t('common.delete', 'Delete')}
                        >
                          <Delete fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button
          variant='text'
          startIcon={<History />}
          sx={{
            fontWeight: 700,
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          {t('auth.sso.view_key_history', 'View Full Key History & Audit Logs')}
        </Button>
      </Box>
    </Container>
  )
}
