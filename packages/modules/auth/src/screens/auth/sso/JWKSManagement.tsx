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
import {
  Key,
  Add,
  Delete,
  ContentCopy,
  Refresh,
  History,
  Security,
  InfoOutlined,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

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
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}
      >
        <Box>
          <Typography variant='h4' fontWeight={800} gutterBottom>
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
            sx={{ height: 48, borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
          >
            {t('auth.sso.rotate_keys', 'Force Rotation')}
          </Button>
          <Button
            variant='contained'
            startIcon={<Add />}
            sx={{ height: 48, borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none' }}
          >
            {t('auth.sso.manual_key', 'Add Manual Key')}
          </Button>
        </Box>
      </Box>

      <Alert
        severity='warning'
        icon={<Security />}
        sx={{ borderRadius: '16px', mb: 4, '& .MuiAlert-message': { fontWeight: 500 } }}
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
                borderRadius: '24px',
                border: '1px solid ' + alpha(theme.palette.divider, 0.1),
                transition: 'all 0.2s',
                '&:hover': { boxShadow: theme.shadows[4] },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems='center'>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        <Key />
                      </Avatar>
                      <Box>
                        <Typography variant='subtitle1' fontWeight={800}>
                          {key.kid}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={key.status.toUpperCase()}
                            size='small'
                            color={key.status === 'active' ? 'success' : 'info'}
                            sx={{
                              height: 20,
                              fontSize: '0.6rem',
                              fontWeight: 800,
                              borderRadius: '4px',
                            }}
                          />
                          <Typography variant='caption' color='text.secondary'>
                            {key.alg}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      fontWeight={600}
                      display='block'
                      gutterBottom
                    >
                      {t('auth.sso.key_health', 'CERTIFICATE HEALTH')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LinearProgress
                        variant='determinate'
                        value={key.health}
                        color={key.health > 90 ? 'success' : 'warning'}
                        sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant='body2' fontWeight={700}>
                        {key.health}%
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                      <Box>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          fontWeight={600}
                          display='block'
                        >
                          {t('common.created', 'CREATED')}
                        </Typography>
                        <Typography variant='body2' fontWeight={600}>
                          {key.created}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          fontWeight={600}
                          display='block'
                        >
                          {t('common.expires', 'EXPIRES')}
                        </Typography>
                        <Typography variant='body2' fontWeight={600}>
                          {key.expires}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title={t('common.copy_kid', 'Copy KID')}>
                        <IconButton size='small'>
                          <ContentCopy fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.details', 'Details')}>
                        <IconButton size='small'>
                          <InfoOutlined fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <IconButton size='small' color='error'>
                        <Delete fontSize='small' />
                      </IconButton>
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
          sx={{ fontWeight: 600, color: 'text.secondary' }}
        >
          {t('auth.sso.view_key_history', 'View Full Key History & Audit Logs')}
        </Button>
      </Box>
    </Container>
  )
}
