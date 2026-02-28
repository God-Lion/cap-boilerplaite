import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  Grid,
  Chip,
  Paper,
  Divider,
  Breadcrumbs,
  Avatar,
} from '@mui/material'
import { Search, Dns, Description, Public, ChevronRight } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function SAMLMetadataBrowser() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [url, setUrl] = useState('')

  const entities = [
    {
      id: 'entity-1',
      name: 'Google Workspace',
      entityId: 'https://accounts.google.com/o/saml2?idpid=C0123456',
      status: 'active',
      verified: true,
    },
    {
      id: 'entity-2',
      name: 'Microsoft Azure AD',
      entityId: 'https://sts.windows.net/72f988bf-86f1-41af/',
      status: 'pending',
      verified: false,
    },
  ]

  return (
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography variant='caption' color='text.secondary'>
            {t('nav.auth', 'Authentication')}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {t('nav.sso', 'SSO')}
          </Typography>
          <Typography variant='caption' color='primary' fontWeight={700}>
            {t('nav.metadata_browser', 'Metadata Browser')}
          </Typography>
        </Breadcrumbs>
        <Typography variant='h4' fontWeight={800} gutterBottom>
          {t('auth.sso.metadata_browser_title', 'Metadata Browser')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {t(
            'auth.sso.metadata_browser_subtitle',
            'Discover and inspect SAML Entity Descriptors from external providers',
          )}
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: '24px',
          mb: 5,
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          overflow: 'visible',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant='subtitle2'
            fontWeight={700}
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Public fontSize='small' color='primary' />
            {t('auth.sso.fetch_remote', 'Fetch Remote Metadata')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder='https://example.com/saml/metadata.xml'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search color='primary' />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '16px',
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                },
              }}
            />
            <Button
              variant='contained'
              sx={{
                height: 56,
                minWidth: 160,
                borderRadius: '16px',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              {t('common.fetch', 'Fetch Metadata')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant='h6' fontWeight={700} sx={{ mb: 3 }}>
        {t('auth.sso.recent_entities', 'Recently Explored Entities')}
      </Typography>

      <Grid container spacing={3}>
        {entities.map((entity) => (
          <Grid key={entity.id} size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '20px',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  >
                    <Dns />
                  </Avatar>
                  <Box>
                    <Typography variant='subtitle1' fontWeight={700}>
                      {entity.name}
                    </Typography>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Description sx={{ fontSize: 12 }} />
                      SAML 2.0 Provider
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={entity.status.toUpperCase()}
                  size='small'
                  color={entity.status === 'active' ? 'success' : 'warning'}
                  sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.65rem' }}
                />
              </Box>

              <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  fontWeight={600}
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  ENTITY ID
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: 'text.primary',
                    wordBreak: 'break-all',
                  }}
                >
                  {entity.entityId}
                </Typography>
              </Box>

              <Button
                fullWidth
                endIcon={<ChevronRight />}
                sx={{
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: 'primary.main',
                  py: 1,
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                }}
              >
                {t('common.view_details', 'View Technical Details')}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
