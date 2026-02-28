import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import { useSetupMfa, useVerifyMfa, useMfaStatus } from '../hooks/useAuthQuery'

export function MfaSetup() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verifyCode, setVerifyCode] = useState('')

  const { data: mfaStatus } = useMfaStatus()
  const setupMutation = useSetupMfa()
  const verifyMutation = useVerifyMfa()

  const handleSetup = () => {
    setupMutation.mutate(
      { method: 'totp' },
      {
        onSuccess: (response) => {
          setQrCode(response.data.qr_code_url)
          setSecret(response.data.secret || '')
          setBackupCodes(response.data.backup_codes)
          setStep('verify')
        },
      },
    )
  }

  const handleVerify = () => {
    verifyMutation.mutate(
      { code: verifyCode, secret },
      {
        onSuccess: () => {
          setOpen(false)
          setStep('setup')
        },
      },
    )
  }

  if (mfaStatus?.enabled) {
    return (
      <Alert
        severity='success'
        sx={{
          borderRadius: 2,
          '& .MuiAlert-message': { fontWeight: 600 },
        }}
      >
        {t('auth.mfa.enabled_status')}
      </Alert>
    )
  }

  return (
    <>
      <Button
        variant='outlined'
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          py: 1,
          px: 3,
        }}
      >
        {t('auth.mfa.button_enable')}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          {t('auth.mfa.dialog_title')}
        </DialogTitle>
        <DialogContent>
          {step === 'setup' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant='body1' paragraph color='text.secondary'>
                {t('auth.mfa.setup_desc_p1')}
              </Typography>
              <Typography variant='body1' paragraph color='text.secondary'>
                {t('auth.mfa.setup_desc_p2')}
              </Typography>
            </Box>
          )}

          {step === 'verify' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 2 }}>
                {t('auth.mfa.verify_step1')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                {qrCode && (
                  <img
                    src={qrCode}
                    alt='QR Code'
                    style={{ width: '180px', height: '180px', display: 'block' }}
                  />
                )}
              </Box>

              <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 1 }}>
                {t('auth.mfa.verify_step2')}
              </Typography>
              <Grid container spacing={1} sx={{ mb: 3 }}>
                {backupCodes.map((code, idx) => (
                  <Grid size={6} key={idx}>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {code}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <TextField
                fullWidth
                label={t('auth.mfa.input_label')}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                margin='normal'
                placeholder='000000'
                slotProps={{
                  input: {
                    sx: { borderRadius: 2, fontWeight: 600, textAlign: 'center', letterSpacing: 4 },
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            {t('auth.mfa.button_cancel')}
          </Button>
          {step === 'setup' && (
            <Button
              variant='contained'
              onClick={handleSetup}
              disabled={setupMutation.isPending}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              {t('auth.mfa.button_continue')}
            </Button>
          )}
          {step === 'verify' && (
            <Button
              variant='contained'
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              {t('auth.mfa.button_verify')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
