import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  alpha,
  useTheme,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { ExpandMore, Save, Security, Language, SwapHoriz, Fingerprint } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function SAMLConfigDashboard() {
  const { t } = useTranslation()
  const theme = useTheme()

  const [settings, setSettings] = useState({
    enabled: true,
    binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
    signAssertions: true,
    encryptAssertions: false,
    attributeMapping: 'Nexus Pattern',
  })

  return (
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
        <Box>
          <Typography variant='h4' fontWeight={800} gutterBottom>
            {t('auth.sso.saml_config_title', 'SAML 2.0 Identity Provider')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t(
              'auth.sso.saml_config_subtitle',
              'Configure system-wide SAML 2.0 federation settings',
            )}
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Save />}
          sx={{
            height: 48,
            borderRadius: '12px',
            px: 4,
            fontWeight: 700,
            textTransform: 'none',
          }}
        >
          {t('common.save_changes', 'Save Configuration')}
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Accordion
              defaultExpanded
              sx={{
                borderRadius: '16px !important',
                '&:before': { display: 'none' },
                boxShadow: theme.shadows[1],
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Language color='primary' />
                  <Typography fontWeight={700}>
                    {t('auth.sso.general_settings', 'General Federation Settings')}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 4 }}>
                <Grid container spacing={4} alignItems='center'>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.enabled}
                          onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                        />
                      }
                      label={t(
                        'auth.sso.enable_saml_idp',
                        'Enable SAML 2.0 Identity Provider flow',
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={t('auth.sso.issuer_uri', 'Issuer / Entity ID URI')}
                      defaultValue='https://auth.nexus-platform.com'
                      variant='outlined'
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      fullWidth
                      label={t('auth.sso.default_binding', 'Default Binding')}
                      value={settings.binding}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    >
                      <MenuItem value='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'>
                        HTTP-POST
                      </MenuItem>
                      <MenuItem value='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect'>
                        HTTP-Redirect
                      </MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded
              sx={{
                mt: 2,
                borderRadius: '16px !important',
                '&:before': { display: 'none' },
                boxShadow: theme.shadows[1],
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Security color='primary' />
                  <Typography fontWeight={700}>
                    {t('auth.sso.security_assertions', 'Security & Assertions')}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 4 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={<Switch checked={settings.signAssertions} />}
                      label={t('auth.sso.sign_assertions', 'Sign Assertions')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={<Switch checked={settings.encryptAssertions} />}
                      label={t('auth.sso.encrypt_assertions', 'Encrypt Assertions')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      fullWidth
                      label={t('auth.sso.signature_algorithm', 'Signature Algorithm')}
                      defaultValue='RSA-SHA256'
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    >
                      <MenuItem value='RSA-SHA256'>RSA-SHA256</MenuItem>
                      <MenuItem value='RSA-SHA512'>RSA-SHA512</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                mt: 2,
                borderRadius: '16px !important',
                '&:before': { display: 'none' },
                boxShadow: theme.shadows[1],
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SwapHoriz color='primary' />
                  <Typography fontWeight={700}>
                    {t('auth.sso.attribute_mapping', 'Attribute Mapping')}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 4 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                  {t(
                    'auth.sso.mapping_desc',
                    'Map internal user attributes to SAML assertion attributes.',
                  )}
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { internal: 'email', saml: 'urn:oid:0.9.2342.19200300.100.1.3' },
                    { internal: 'username', saml: 'urn:oid:2.5.4.42' },
                    { internal: 'displayName', saml: 'urn:oid:2.16.840.1.113730.3.1.241' },
                  ].map((mapping) => (
                    <Grid key={mapping.internal} size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          size='small'
                          fullWidth
                          value={mapping.internal}
                          disabled
                          sx={{ flex: 1 }}
                        />
                        <ArrowForward sx={{ color: 'text.secondary' }} />
                        <TextField
                          size='small'
                          fullWidth
                          value={mapping.saml}
                          sx={{ flex: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '20px',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Fingerprint color='primary' />
              <Typography variant='h6' fontWeight={700}>
                {t('auth.sso.active_certificates', 'Active Certificates')}
              </Typography>
            </Box>

            <Card
              sx={{
                borderRadius: '12px',
                mb: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant='subtitle2' fontWeight={700}>
                  Prod Signing Key
                </Typography>
                <Typography variant='caption' color='text.secondary' display='block'>
                  Expires: Dec 20, 2026
                </Typography>
                <Chip
                  label='PRIMARY'
                  size='small'
                  color='success'
                  sx={{
                    mt: 1,
                    borderRadius: '6px',
                    fontWeight: 700,
                    height: 20,
                    fontSize: '0.6rem',
                  }}
                />
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: '12px',
                border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant='subtitle2' fontWeight={700}>
                  Next-Gen Rotation Key
                </Typography>
                <Typography variant='caption' color='text.secondary' display='block'>
                  Pending Activation
                </Typography>
                <Chip
                  label='STANDBY'
                  size='small'
                  color='info'
                  sx={{
                    mt: 1,
                    borderRadius: '6px',
                    fontWeight: 700,
                    height: 20,
                    fontSize: '0.6rem',
                  }}
                />
              </CardContent>
            </Card>

            <Button
              fullWidth
              variant='outlined'
              sx={{ mt: 3, borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
            >
              {t('auth.sso.manage_keys', 'Manage Key Pairs')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

function ArrowForward(props: any) {
  return (
    <svg
      {...props}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M5 12h14M12 5l7 7-7 7' />
    </svg>
  )
}
