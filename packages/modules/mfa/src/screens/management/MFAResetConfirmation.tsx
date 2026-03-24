import { useState } from 'react'
import {
  Box, Typography, Card, Button, Stack, Avatar, Chip,
  RadioGroup, FormControlLabel, Radio, Divider, Alert,
  TextField, InputAdornment, alpha, useTheme,
} from '@mui/material'
import {
  Shield, Smartphone, Sms, VpnKey, Info, Refresh,
  DeleteForever, VpnKey as TempCodeIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function MFAResetConfirmation() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const [resetMethod, setResetMethod] = useState('full')
  const [adminPassword, setAdminPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleReset = () => { setIsProcessing(true); setTimeout(() => setIsProcessing(false), 2000) }

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ maxWidth: 900, width: '100%', mx: 'auto', p: { xs: 2, md: 4, lg: 5 }, display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.027em', mb: 1 }}>
          {t('mfa.resetConfirmationTitle', 'MFA Reset Confirmation')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {t('mfa.resetConfirmationDesc', 'Review user status and select a reset method. This action is logged.')}
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: (t) => alpha(t.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700 }}>JD</Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Jane Doe</Typography>
          <Typography variant="body2" color="text.secondary">jane.doe@example.com</Typography>
        </Box>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '5fr 7fr' }, gap: 4 }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Info fontSize="small" color="primary" />
            {t('mfa.currentStatus', 'Current MFA Status')}
          </Typography>
          <Stack spacing={2}>
            {[
              { icon: <Smartphone fontSize="small" color="action" />, label: t('mfa.authenticatorApp', 'Authenticator App'), detail: 'Used 2h ago', active: true },
              { icon: <Sms fontSize="small" color="disabled" />, label: t('mfa.smsVerification', 'SMS Verification'), detail: 'Not configured', active: false },
              { icon: <VpnKey fontSize="small" color="action" />, label: t('mfa.backupCodes', 'Backup Codes'), detail: '3 remaining', active: true },
            ].map(({ icon, label, detail, active }) => (
              <Card key={label} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: active ? 'transparent' : 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  {icon}
                  <Typography variant="body2" sx={{ fontWeight: 600, color: active ? 'text.primary' : 'text.disabled' }}>{label}</Typography>
                  {active && <Chip label="Active" size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />}
                </Box>
                <Typography variant="caption" color={active ? 'text.secondary' : 'text.disabled'}>{detail}</Typography>
              </Card>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Refresh fontSize="small" color="primary" />
            {t('mfa.resetOptions', 'Reset Options')}
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <RadioGroup value={resetMethod} onChange={(e) => setResetMethod(e.target.value)}>
              {[
                { value: 'refresh', title: t('mfa.refreshTrust', 'Refresh Trust'), desc: 'Clears sessions and trusted devices. User retains current MFA configuration.', icon: null, color: 'text.primary' },
                { value: 'full', title: t('mfa.fullReset', 'Full MFA Reset'), desc: 'Revokes all factors. User must re-enroll on next login.', icon: <DeleteForever fontSize="small" />, color: 'error.main' },
                { value: 'temp', title: t('mfa.tempCode', 'Generate Temporary Code'), desc: 'Create a temporary one-time code for emergency access.', icon: <TempCodeIcon fontSize="small" />, color: 'text.primary' },
              ].map(({ value, title, desc, icon, color }, i, arr) => (
                <Box key={value}>
                  <Box sx={{ p: 2, bgcolor: resetMethod === value && value === 'full' ? alpha(theme.palette.error.main, 0.04) : 'transparent', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                    <FormControlLabel value={value} control={<Radio size="small" color={value === 'full' ? 'error' : 'primary'} />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {icon}{title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{desc}</Typography>
                        </Box>
                      }
                      sx={{ m: 0, alignItems: 'flex-start' }}
                    />
                  </Box>
                  {i < arr.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
                </Box>
              ))}
            </RadioGroup>
          </Card>

          <Box sx={{ mt: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Shield fontSize="small" color="primary" />
              {t('mfa.securityVerification', 'Security Verification')}
            </Typography>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              {t('mfa.criticalActionWarning', 'Critical action: Please verify your identity before proceeding.')}
            </Alert>
            <TextField fullWidth type="password" placeholder="Enter admin password" value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)} sx={{ mb: 2 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><VpnKey fontSize="small" /></InputAdornment> } }} />
            <Stack direction="row" spacing={2}>
              <Button fullWidth variant="contained" color={resetMethod === 'full' ? 'error' : 'info'} disabled={!adminPassword || isProcessing} onClick={handleReset}
                sx={{ py: 1.5, fontWeight: 800, borderRadius: 3, textTransform: 'none', ...(resetMethod !== 'full' && { bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark' } }) }}>
                {isProcessing ? t('common.processing', 'Processing...') : t('mfa.confirmReset', 'Confirm Reset Action')}
              </Button>
              <Button fullWidth variant="outlined" sx={{ py: 1.5, fontWeight: 700, borderRadius: 3, textTransform: 'none' }}>
                {t('common.cancel', 'Cancel')}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
