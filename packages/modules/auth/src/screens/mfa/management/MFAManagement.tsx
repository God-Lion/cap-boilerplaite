import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Typography, Card, CardContent, Chip, Avatar,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, alpha, useTheme,
} from '@mui/material'
import {
  Lock, Smartphone, Sms, Key, Edit, Delete,
  ContentCopy, Refresh, WarningAmber, CheckCircle, Shield, ArrowBack,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface MfaMethod { id: string; type: 'authenticator' | 'sms'; name: string; detail: string; addedDate: string; isActive: boolean }

const MOCK_METHODS: MfaMethod[] = [
  { id: '1', type: 'authenticator', name: 'Authenticator App', detail: 'Google Authenticator', addedDate: 'Oct 24, 2023', isActive: true },
  { id: '2', type: 'sms', name: 'SMS Text Message', detail: '+1 (555) *** - **99', addedDate: 'Sep 15, 2023', isActive: true },
]

export default function MFAManagement() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [methods] = useState<MfaMethod[]>(MOCK_METHODS)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [recoveryCodesVisible, setRecoveryCodesVisible] = useState(false)

  const getMethodIcon = useCallback((type: string) => {
    switch (type) {
      case 'authenticator': return <Smartphone />
      case 'sms': return <Sms />
      default: return <Shield />
    }
  }, [])

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ width: '100%', maxWidth: 640, mx: 'auto', p: { xs: 3, md: 5 } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}>
          {t('common.back', 'Back')}
        </Button>
        <Typography variant="body2" color="text.secondary">/</Typography>
        <Typography variant="body2" color="text.secondary">{t('mfa.security', 'Security')}</Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar variant="square"
          sx={{ width: 56, height: 56, bgcolor: 'transparent', color: 'primary.main', borderRadius: '24px', border: '2px solid', borderColor: alpha(theme.palette.primary.main, 0.2), flexShrink: 0 }}>
          <Lock sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.027em' }}>
            {t('mfa.twoFactorAuth', 'Two-Factor Authentication')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            {t('mfa.managementDescription', 'Manage verification methods for your account.')}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 3, border: 1, borderColor: 'success.main', bgcolor: (t) => alpha(t.palette.success.main, 0.05) }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
          <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>{t('mfa.currentlyEnabled', 'MFA is currently enabled')}</Typography>
            <Typography variant="body2" color="text.secondary">{t('mfa.accountProtected', "We'll ask for a code when you sign in from a new device.")}</Typography>
          </Box>
          <Chip label={t('mfa.active', 'Active')} color="success" size="small" />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
              {t('mfa.configuredMethods', 'Configured Methods')}
            </Typography>
          </Box>
          <List disablePadding>
            {methods.map((method, index) => (
              <ListItem key={method.id} sx={{ px: 3, py: 2, borderBottom: index < methods.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                <ListItemIcon sx={{ minWidth: 48, '& .MuiSvgIcon-root': { fontSize: 24, color: method.isActive ? 'primary.main' : 'text.disabled' } }}>
                  {getMethodIcon(method.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>{method.name}</Typography>
                      {method.isActive && <Chip label={t('mfa.active', 'Active')} size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />}
                    </Box>
                  }
                  secondary={`${method.detail} • Added on ${method.addedDate}`}
                />
                <ListItemSecondaryAction>
                  <IconButton size="small" sx={{ mr: 0.5 }}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box sx={{ px: 3, py: 2 }}>
            <Button variant="outlined" size="small" onClick={() => navigate('/auth/mfa/add-method')}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
              {t('mfa.addNewMethod', '+ Add New Method')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Key sx={{ color: 'warning.main' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>{t('mfa.recoveryCodesTitle', 'Recovery Codes')}</Typography>
              <Typography variant="body2" color="text.secondary">{t('mfa.recoveryCodesInfo', 'Single-use codes for emergency access. Keep them safe.')}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="outlined" size="small" startIcon={<ContentCopy />}
              onClick={() => setRecoveryCodesVisible(!recoveryCodesVisible)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
              {t('mfa.viewCodes', 'View Codes')}
            </Button>
            <Button variant="outlined" size="small" startIcon={<Refresh />} color="warning"
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
              {t('mfa.regenerateCodes', 'Regenerate')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, border: 1, borderColor: (t) => alpha(t.palette.error.main, 0.3), bgcolor: (t) => alpha(t.palette.error.main, 0.02) }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningAmber sx={{ color: 'error.main' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} color="error.main">{t('mfa.deactivateTitle', 'Deactivate MFA')}</Typography>
              <Typography variant="body2" color="text.secondary">{t('mfa.deactivateWarning', 'Disabling MFA significantly lowers your account security.')}</Typography>
            </Box>
            <Button variant="outlined" color="error" size="small" onClick={() => setShowDeactivateDialog(true)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap' }}>
              {t('mfa.deactivate', 'Deactivate')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={showDeactivateDialog} onClose={() => setShowDeactivateDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{t('mfa.confirmDeactivate', 'Confirm Deactivation')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t('mfa.deactivateConfirmText', 'Are you sure? This will remove all MFA methods and reduce account security.')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowDeactivateDialog(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>{t('common.cancel', 'Cancel')}</Button>
          <Button variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>{t('mfa.yesDeactivate', 'Yes, Deactivate')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
