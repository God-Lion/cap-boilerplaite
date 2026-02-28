import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
  Link,
  Avatar,
} from '@mui/material'
import { Fingerprint, Security } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { startRegistration } from '@simplewebauthn/browser'
import authService from '../../services/auth.service'

interface PasskeySetupProps {
  open?: boolean
  onClose?: () => void
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function PasskeySetup({
  open = true,
  onClose,
  onSuccess,
  onError,
}: PasskeySetupProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false)

  const handleSetupPasskey = async () => {
    setLoading(true)
    setWaitingForConfirmation(true)

    try {
      // Get registration options from server
      const optionsRes = await authService.passkeys.getRegistrationOptions()
      const options = optionsRes.data

      // Start WebAuthn registration (browser will show native prompt)
      const regResp = await startRegistration(options)

      // Verify registration with server
      await authService.passkeys.verifyRegistration(regResp)

      onSuccess?.()
    } catch (err: any) {
      console.error('Passkey registration error:', err)
      const errorMessage =
        err.message ||
        t('auth.passkey.error_setup_failed', 'Passkey registration cancelled or failed')
      onError?.(errorMessage)
    } finally {
      setLoading(false)
      setWaitingForConfirmation(false)
    }
  }

  const handleUseSecurityKey = async () => {
    // Same flow but may allow user to select hardware security key
    await handleSetupPasskey()
  }

  const handleCancel = () => {
    if (!loading) onClose?.()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth='xs'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          p: 2,
        },
      }}
    >
      <DialogContent sx={{ px: 4, py: 5, textAlign: 'center' }}>
        {/* Fingerprint Icon */}
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.light',
            color: 'primary.main',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Fingerprint sx={{ fontSize: 40 }} />
        </Avatar>

        {/* Title */}
        <Typography
          variant='h5'
          fontWeight={700}
          gutterBottom
          sx={{ color: 'text.primary', mb: 1 }}
        >
          {t('auth.passkey.setup_title')}
        </Typography>

        {/* Description */}
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            mb: 4,
            lineHeight: 1.6,
            maxWidth: 340,
            mx: 'auto',
          }}
        >
          {t('auth.passkey.setup_desc')}
        </Typography>

        {/* Waiting State */}
        {waitingForConfirmation ? (
          <Box
            sx={{
              bgcolor: 'action.hover',
              borderRadius: 2,
              py: 2,
              px: 3,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={20} thickness={4} />
            <Typography variant='body2' color='text.secondary' fontWeight={500}>
              {t('auth.passkey.waiting_confirmation')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mb: 3, minHeight: 56 }} /> // Spacer to maintain layout
        )}

        {/* Helper Text */}
        {waitingForConfirmation && (
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ display: 'block', mb: 3, fontSize: 13 }}
          >
            {t('auth.passkey.check_browser')}
          </Typography>
        )}

        {/* Use Security Key Button */}
        <Button
          fullWidth
          variant='outlined'
          startIcon={<Security />}
          onClick={handleUseSecurityKey}
          disabled={loading}
          sx={{
            py: 1.5,
            mb: 2,
            borderRadius: 2,
            fontWeight: 600,
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          {t('auth.passkey.use_security_key')}
        </Button>

        {/* Cancel Link */}
        <Link
          component='button'
          variant='body2'
          onClick={handleCancel}
          underline='none'
          disabled={loading}
          sx={{
            display: 'block',
            color: 'text.secondary',
            fontWeight: 500,
            cursor: 'pointer',
            '&:hover': {
              color: 'text.primary',
            },
            '&:disabled': {
              color: 'text.disabled',
              cursor: 'not-allowed',
            },
          }}
        >
          {t('auth.common.cancel')}
        </Link>

        {/* Secured by WebAuthn Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            mt: 4,
          }}
        >
          <Security sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant='caption' color='text.disabled' fontWeight={500}>
            {t('auth.passkey.secured_by_webauthn')}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
