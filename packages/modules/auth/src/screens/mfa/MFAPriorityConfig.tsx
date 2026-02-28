import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Switch,
  TextField,
  Button,
  Stack,
  Divider,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  DragIndicator,
  InfoOutlined,
  Smartphone,
  VpnKey,
  Sms,
  Email,
  Save,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface MfaMethod {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

export default function MFAPriorityConfig() {
  const { t } = useTranslation()

  // State
  const [methods] = useState<MfaMethod[]>([
    {
      id: 'totp',
      title: 'Authenticator App (TOTP)',
      description: 'Google Authenticator, Authy, 1Password',
      icon: <Smartphone color='primary' />,
    },
    {
      id: 'webauthn',
      title: 'Security Key (WebAuthn)',
      description: 'YubiKey, Titan, Windows Hello',
      icon: <VpnKey color='primary' />,
    },
    {
      id: 'sms',
      title: 'SMS Verification',
      description: 'OTP sent via text message',
      icon: <Sms color='primary' />,
    },
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Link or code sent via email',
      icon: <Email color='primary' />,
    },
  ])

  const [enforcement, setEnforcement] = useState({
    everyLogin: true,
    sensitiveActions: true,
    trustDuration: '30',
    ipWhitelist: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (field: keyof typeof enforcement) => {
    setEnforcement((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        height: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          p: { xs: 2, md: 4, lg: 5 },
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                mb: 1,
              }}
            >
              {t('auth.mfa.config_title', 'MFA Configuration')}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 700 }}>
              {t(
                'auth.mfa.config_desc',
                'Manage multi-factor authentication hierarchy, define fallback logic for failed attempts, and configure global enforcement policies.',
              )}
            </Typography>
          </Box>
          <Button
            variant='contained'
            startIcon={<Save />}
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              whiteSpace: 'nowrap',
            }}
          >
            {isSaving ? t('common.saving', 'Saving...') : t('common.save_changes', 'Save Changes')}
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' },
            gap: 4,
            alignItems: 'start',
          }}
        >
          {/* Left Column: Priority & Fallback */}
          <Stack spacing={4}>
            {/* Method Priority */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
                  {t('auth.mfa.priority_title', 'Method Priority Order')}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {t(
                    'auth.mfa.priority_desc',
                    'Drag and drop to reorder. The top method will be the default prompt for users.',
                  )}
                </Typography>
              </Box>

              <Card
                variant='outlined'
                sx={{
                  borderRadius: 3,
                  borderColor: 'divider',
                  overflow: 'hidden',
                }}
              >
                <Stack divider={<Divider />}>
                  {methods.map((method) => (
                    <Box
                      key={method.id}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        '&:hover': { bgcolor: 'action.hover' },
                        transition: 'background-color 0.2s',
                        cursor: 'grab',
                      }}
                    >
                      <DragIndicator sx={{ color: 'text.disabled' }} />
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: 'primary.lighterOpacity',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {method.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {method.title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {method.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Box>

            {/* Fallback Logic */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
                  {t('auth.mfa.fallback_title', 'Fallback Logic Chain')}
                </Typography>
              </Box>
              <Card
                variant='outlined'
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                }}
              >
                <TextField
                  select
                  fullWidth
                  label={t('auth.mfa.fallback_policy', 'Fallback Policy')}
                  defaultValue='sequential'
                  SelectProps={{ native: true }}
                >
                  <option value='sequential'>Sequential (Try each method in order)</option>
                  <option value='selection'>Selection (Allow user to choose fallback)</option>
                  <option value='strict'>Strict (No fallback, deny access on failure)</option>
                </TextField>
              </Card>
            </Box>
          </Stack>

          {/* Right Column: Enforcement */}
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
                {t('auth.mfa.enforcement_title', 'Enforcement & Exceptions')}
              </Typography>
            </Box>
            <Card
              variant='outlined'
              sx={{
                p: 3,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enforcement.everyLogin}
                      onChange={() => handleToggle('everyLogin')}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {t('auth.mfa.force_every_login', 'Force MFA on every login')}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {t(
                          'auth.mfa.force_every_login_desc',
                          'If disabled, MFA will only be required on new devices.',
                        )}
                      </Typography>
                    </Box>
                  }
                  labelPlacement='start'
                  sx={{ width: '100%', m: 0, justifyContent: 'space-between' }}
                />
              </Box>

              <Divider />

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enforcement.sensitiveActions}
                      onChange={() => handleToggle('sensitiveActions')}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {t('auth.mfa.sensitive_actions', 'Require for sensitive actions')}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {t(
                          'auth.mfa.sensitive_actions_desc',
                          'Billing changes, role updates, and API key generation.',
                        )}
                      </Typography>
                    </Box>
                  }
                  labelPlacement='start'
                  sx={{ width: '100%', m: 0, justifyContent: 'space-between' }}
                />
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  {t('auth.mfa.trust_duration', 'Trust Duration (Days)')}
                  <Tooltip title='Duration before re-prompting MFA on a trusted browser.'>
                    <IconButton size='small'>
                      <InfoOutlined fontSize='inherit' />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <TextField
                  fullWidth
                  type='number'
                  value={enforcement.trustDuration}
                  onChange={(e) =>
                    setEnforcement((prev) => ({ ...prev, trustDuration: e.target.value }))
                  }
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>Days</InputAdornment>,
                  }}
                />
              </Box>

              <Box>
                <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                  {t('auth.mfa.ip_whitelist', 'IP Whitelist')}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder='192.168.1.1/24, 10.0.0.1'
                  helperText={t(
                    'auth.mfa.ip_whitelist_desc',
                    'IP ranges that bypass MFA requirements (e.g. Office VPN).',
                  )}
                />
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
