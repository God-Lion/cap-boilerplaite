import { useState } from 'react'
import {
  Box, Typography, Card, Switch, TextField, Button, Stack,
  Divider, FormControlLabel, InputAdornment, IconButton, Tooltip, alpha,
} from '@mui/material'
import { DragIndicator, InfoOutlined, Smartphone, VpnKey, Sms, Email, Save } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface MfaMethod { id: string; title: string; description: string; icon: React.ReactNode }

export default function MFAPriorityConfig() {
  const { t } = useTranslation('auth')

  const [methods] = useState<MfaMethod[]>([
    { id: 'totp', title: 'Authenticator App (TOTP)', description: 'Google Authenticator, Authy, 1Password', icon: <Smartphone color="info" /> },
    { id: 'webauthn', title: 'Security Key (WebAuthn)', description: 'YubiKey, Titan, Windows Hello', icon: <VpnKey color="info" /> },
    { id: 'sms', title: 'SMS Verification', description: 'OTP sent via text message', icon: <Sms color="info" /> },
    { id: 'email', title: 'Email Verification', description: 'Link or code sent via email', icon: <Email color="info" /> },
  ])

  const [enforcement, setEnforcement] = useState({ everyLogin: true, sensitiveActions: true, trustDuration: '30', ipWhitelist: '' })
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (field: keyof typeof enforcement) => setEnforcement((prev) => ({ ...prev, [field]: !prev[field] }))
  const handleSave = () => { setIsSaving(true); setTimeout(() => setIsSaving(false), 1500) }

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ maxWidth: 1200, width: '100%', mx: 'auto', p: { xs: 2, md: 4, lg: 5 }, display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.027em', mb: 1 }}>
            {t('mfa.configTitle', 'MFA Configuration')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 700 }}>
            {t('mfa.configDesc', 'Manage authentication hierarchy, fallback logic, and enforcement policies.')}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={isSaving}
          sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 3, px: 3, whiteSpace: 'nowrap', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' } }}>
          {isSaving ? t('common.saving', 'Saving...') : t('common.saveChanges', 'Save Changes')}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 4, alignItems: 'start' }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>
              {t('mfa.priorityTitle', 'Method Priority Order')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('mfa.priorityDesc', 'Drag to reorder. The top method is the default for users.')}
            </Typography>
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', overflow: 'hidden' }}>
              <Stack divider={<Divider />}>
                {methods.map((method) => (
                  <Box key={method.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s', cursor: 'grab' }}>
                    <DragIndicator sx={{ color: 'text.disabled' }} />
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: (t) => alpha(t.palette.info.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {method.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{method.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{method.description}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 2 }}>
              {t('mfa.fallbackTitle', 'Fallback Logic Chain')}
            </Typography>
            <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <TextField select fullWidth label={t('mfa.fallbackPolicy', 'Fallback Policy')} defaultValue="sequential"
                slotProps={{ select: { native: true } }}>
                <option value="sequential">Sequential (Try each method in order)</option>
                <option value="selection">Selection (Allow user to choose fallback)</option>
                <option value="strict">Strict (No fallback, deny access on failure)</option>
              </TextField>
            </Card>
          </Box>
        </Stack>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 2 }}>
            {t('mfa.enforcementTitle', 'Enforcement & Exceptions')}
          </Typography>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControlLabel
              control={<Switch checked={enforcement.everyLogin} onChange={() => handleToggle('everyLogin')} color="info" />}
              label={<Box><Typography variant="body2" sx={{ fontWeight: 600 }}>{t('mfa.forceEveryLogin', 'Force MFA on every login')}</Typography><Typography variant="caption" color="text.secondary">{t('mfa.forceEveryLoginDesc', 'If disabled, only required on new devices.')}</Typography></Box>}
              labelPlacement="start" sx={{ width: '100%', m: 0, justifyContent: 'space-between' }}
            />
            <Divider />
            <FormControlLabel
              control={<Switch checked={enforcement.sensitiveActions} onChange={() => handleToggle('sensitiveActions')} color="info" />}
              label={<Box><Typography variant="body2" sx={{ fontWeight: 600 }}>{t('mfa.sensitiveActions', 'Require for sensitive actions')}</Typography><Typography variant="caption" color="text.secondary">{t('mfa.sensitiveActionsDesc', 'Billing, role updates, and API key generation.')}</Typography></Box>}
              labelPlacement="start" sx={{ width: '100%', m: 0, justifyContent: 'space-between' }}
            />
            <Divider />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {t('mfa.trustDuration', 'Trust Duration (Days)')}
                <Tooltip title="Duration before re-prompting MFA on a trusted browser.">
                  <IconButton size="small"><InfoOutlined fontSize="inherit" /></IconButton>
                </Tooltip>
              </Typography>
              <TextField fullWidth type="number" value={enforcement.trustDuration}
                onChange={(e) => setEnforcement((prev) => ({ ...prev, trustDuration: e.target.value }))}
                slotProps={{ input: { endAdornment: <InputAdornment position="end">Days</InputAdornment> } }} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>{t('mfa.ipWhitelist', 'IP Whitelist')}</Typography>
              <TextField fullWidth multiline rows={3} placeholder="192.168.1.1/24, 10.0.0.1"
                helperText={t('mfa.ipWhitelistDesc', 'IP ranges that bypass MFA requirements (e.g. Office VPN).')} />
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}
