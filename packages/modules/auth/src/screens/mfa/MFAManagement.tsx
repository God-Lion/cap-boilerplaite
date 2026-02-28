import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  alpha,
} from '@mui/material'
import {
  Lock,
  Smartphone,
  Sms,
  Key,
  Edit,
  Delete,
  ContentCopy,
  Refresh,
  WarningAmber,
  CheckCircle,
  Shield,
  ArrowBack,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface MfaMethod {
  id: string
  type: 'authenticator' | 'sms'
  name: string
  detail: string
  addedDate: string
  isActive: boolean
}

const MOCK_METHODS: MfaMethod[] = [
  {
    id: '1',
    type: 'authenticator',
    name: 'Authenticator App',
    detail: 'Google Authenticator',
    addedDate: 'Oct 24, 2023',
    isActive: true,
  },
  {
    id: '2',
    type: 'sms',
    name: 'SMS Text Message',
    detail: '+1 (555) *** - **99',
    addedDate: 'Sep 15, 2023',
    isActive: true,
  },
]

export default function MFAManagement() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [methods] = useState<MfaMethod[]>(MOCK_METHODS)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [recoveryCodesVisible, setRecoveryCodesVisible] = useState(false)

  const getMethodIcon = useCallback((type: string) => {
    switch (type) {
      case 'authenticator':
        return <Smartphone />
      case 'sms':
        return <Sms />
      default:
        return <Shield />
    }
  }, [])

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
        >
          {t('common.back', 'Back')}
        </Button>
        <Typography variant='body2' color='text.secondary'>
          /
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('auth.mfa.security', 'Security')}
        </Typography>
      </Box>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Lock sx={{ fontSize: 24, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant='h5' fontWeight={700} letterSpacing='-0.02em'>
              {t('auth.mfa.two_factor_auth', 'Two-Factor Authentication')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t(
                'auth.mfa.management_description',
                'Enhance your account security by requiring a verification code in addition to your password when signing in.',
              )}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* MFA Status Banner */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: 1,
          borderColor: 'success.main',
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
        }}
      >
        <CardContent
          sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}
        >
          <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant='subtitle1' fontWeight={600}>
              {t('auth.mfa.currently_enabled', 'MFA is currently enabled')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t(
                'auth.mfa.account_protected',
                "Your account is protected. We'll ask for a verification code when you log in from a new device.",
              )}
            </Typography>
          </Box>
          <Chip label={t('auth.mfa.active', 'Active')} color='success' size='small' />
        </CardContent>
      </Card>

      {/* Configured Methods */}
      <Card sx={{ mb: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant='subtitle1' fontWeight={600}>
              {t('auth.mfa.configured_methods', 'Configured Methods')}
            </Typography>
          </Box>
          <List disablePadding>
            {methods.map((method, index) => (
              <ListItem
                key={method.id}
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: index < methods.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 48,
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                      color: method.isActive ? 'primary.main' : 'text.disabled',
                    },
                  }}
                >
                  {getMethodIcon(method.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='subtitle2' fontWeight={600}>
                        {method.name}
                      </Typography>
                      {method.isActive && (
                        <Chip
                          label={t('auth.mfa.active', 'Active')}
                          size='small'
                          color='success'
                          variant='outlined'
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={`${method.detail} • Added on ${method.addedDate}`}
                />
                <ListItemSecondaryAction>
                  <IconButton size='small' sx={{ mr: 0.5 }}>
                    <Edit fontSize='small' />
                  </IconButton>
                  <IconButton size='small' color='error'>
                    <Delete fontSize='small' />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box sx={{ px: 3, py: 2 }}>
            <Button
              variant='outlined'
              size='small'
              onClick={() => navigate('/auth/mfa/add-method')}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              {t('auth.mfa.add_new_method', '+ Add New Method')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Recovery Codes */}
      <Card sx={{ mb: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Key sx={{ color: 'warning.main' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant='subtitle1' fontWeight={600}>
                {t('auth.mfa.recovery_codes_title', 'Recovery Codes')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t(
                  'auth.mfa.recovery_codes_info',
                  'If you lose access to your devices, these single-use codes are your only way back in. Keep them safe.',
                )}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant='outlined'
              size='small'
              startIcon={<ContentCopy />}
              onClick={() => setRecoveryCodesVisible(!recoveryCodesVisible)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              {t('auth.mfa.view_codes', 'View Codes')}
            </Button>
            <Button
              variant='outlined'
              size='small'
              startIcon={<Refresh />}
              color='warning'
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              {t('auth.mfa.regenerate_codes', 'Regenerate')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Deactivate MFA */}
      <Card
        sx={{
          borderRadius: 3,
          border: 1,
          borderColor: (theme) => alpha(theme.palette.error.main, 0.3),
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.02),
        }}
      >
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningAmber sx={{ color: 'error.main' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant='subtitle1' fontWeight={600} color='error.main'>
                {t('auth.mfa.deactivate_title', 'Deactivate MFA')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t(
                  'auth.mfa.deactivate_warning',
                  'Disabling Two-Factor Authentication significantly lowers your account security. This action is not recommended.',
                )}
              </Typography>
            </Box>
            <Button
              variant='outlined'
              color='error'
              size='small'
              onClick={() => setShowDeactivateDialog(true)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap' }}
            >
              {t('auth.mfa.deactivate', 'Deactivate')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Deactivate Dialog */}
      <Dialog
        open={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {t('auth.mfa.confirm_deactivate', 'Confirm Deactivation')}
        </DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary'>
            {t(
              'auth.mfa.deactivate_confirm_text',
              'Are you sure you want to disable Two-Factor Authentication? This will remove all configured MFA methods and significantly reduce your account security.',
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowDeactivateDialog(false)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant='contained'
            color='error'
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {t('auth.mfa.yes_deactivate', 'Yes, Deactivate')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
