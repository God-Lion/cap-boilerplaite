import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  alpha,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material'
import { ContentCopy, Download, Code, Link, VerifiedUser } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`metadata-tabpanel-${index}`}
      aria-labelledby={`metadata-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const MetadataField = ({
  label,
  value,
  isCode = false,
}: {
  label: string
  value: string
  isCode?: boolean
}) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography
          variant='caption'
          fontWeight={700}
          color='text.secondary'
          sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
        >
          {label}
        </Typography>
        <Tooltip title={t('common.copy', 'Copy')}>
          <IconButton
            size='small'
            onClick={() => {
              navigator.clipboard.writeText(value)
              // If we want to show the snackbar, we need a callback.
              // For now, let's just copy.
              // Or better, dispatch a custom event? No.
            }}
          >
            <ContentCopy fontSize='inherit' />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          p: 2,
          borderRadius: '12px',
          backgroundColor: alpha(theme.palette.action.hover, 0.05),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          fontFamily: isCode ? 'monospace' : 'inherit',
          fontSize: isCode ? '0.85rem' : '0.95rem',
          wordBreak: 'break-all',
          whiteSpace: isCode ? 'pre-wrap' : 'normal',
          color: theme.palette.text.primary,
        }}
      >
        {value}
      </Box>
    </Box>
  )
}

export default function SAMLMetadataDisplay() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)
  const [copySuccess, setCopySuccess] = useState(false)

  const metadata = {
    entityId: 'https://auth.nexus-platform.com/saml/metadata',
    acsUrl: 'https://auth.nexus-platform.com/saml/acs',
    sloUrl: 'https://auth.nexus-platform.com/saml/slo',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIDdTCCAl2gAwIBAgILBAAAAAABFUtaw5QwDQYJKoZIhvcNAQEFBQAwVzELMAkG\nA1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExEDAOBgNVBAsTB1Jv\nb3QgQ0ExGzAZBgNVBAMTEkdsb2JhbFNpZ24gUm9vdCBDQTAeFw05ODA5MDExMjAw\n...',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://auth.nexus-platform.com/saml/metadata">
  <md:SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://auth.nexus-platform.com/saml/slo"/>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://auth.nexus-platform.com/saml/acs" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`,
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
  }

  return (
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' fontWeight={800} gutterBottom>
            {t('auth.sso.saml_metadata_title', 'SAML 2.0 Metadata')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t('auth.sso.saml_metadata_subtitle', 'Configuration details for Identity Providers')}
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Download />}
          sx={{
            height: 48,
            borderRadius: '12px',
            textTransform: 'none',
            px: 3,
            fontWeight: 700,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {t('auth.sso.download_xml', 'Download Metadata XML')}
        </Button>
      </Box>

      <Card sx={{ borderRadius: '20px', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 64,
                fontSize: '0.95rem',
              },
            }}
          >
            <Tab
              icon={<Link sx={{ mr: 1 }} />}
              iconPosition='start'
              label={t('auth.sso.tab_endpoints', 'Endpoints')}
            />
            <Tab
              icon={<VerifiedUser sx={{ mr: 1 }} />}
              iconPosition='start'
              label={t('auth.sso.tab_certificates', 'Certificates')}
            />
            <Tab
              icon={<Code sx={{ mr: 1 }} />}
              iconPosition='start'
              label={t('auth.sso.tab_preview', 'Raw XML Preview')}
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <TabPanel value={tabValue} index={0}>
            <MetadataField label={t('auth.sso.entity_id', 'Entity ID')} value={metadata.entityId} />
            <MetadataField
              label={t('auth.sso.acs_url', 'Assertion Consumer Service (ACS) URL')}
              value={metadata.acsUrl}
            />
            <MetadataField
              label={t('auth.sso.slo_url', 'Single Logout (SLO) URL')}
              value={metadata.sloUrl}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <MetadataField
              label={t('auth.sso.signing_cert', 'Signing Certificate (X.509)')}
              value={metadata.certificate}
              isCode
            />
            <Alert
              severity='info'
              sx={{
                borderRadius: '12px',
                mt: 2,
                '& .MuiAlert-message': { fontWeight: 500 },
              }}
            >
              {t(
                'auth.sso.cert_info',
                'This certificate is used by Identity Providers to verify assertions signed by Nexus.',
              )}
            </Alert>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box
              sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: '#1E1E1E',
                color: '#D4D4D4',
                fontFamily: '"Fira Code", monospace',
                fontSize: '0.85rem',
                overflowX: 'auto',
                position: 'relative',
                border: '1px solid #333',
              }}
            >
              <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                <IconButton
                  size='small'
                  onClick={() => handleCopy(metadata.xml)}
                  sx={{ color: '#888', '&:hover': { color: '#fff' } }}
                >
                  <ContentCopy fontSize='inherit' />
                </IconButton>
              </Box>
              <pre style={{ margin: 0 }}>{metadata.xml}</pre>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity='success' sx={{ borderRadius: '12px' }}>
          {t('common.copied_to_clipboard', 'Copied to clipboard!')}
        </Alert>
      </Snackbar>
    </Container>
  )
}
