import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { useResetUserPassword } from '../../hooks/useAdminQuery'

interface ResetPasswordDialogProps {
  open: boolean
  onClose: () => void
  userId: number | string
}

export default function ResetPasswordDialog({ open, onClose, userId }: ResetPasswordDialogProps) {
  const { t } = useTranslation('common')
  const { enqueueSnackbar } = useSnackbar()
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const resetPasswordMutation = useResetUserPassword({
    onSuccess: () => {
      onClose()
      setNewPassword('')
      enqueueSnackbar(t('auth.admin.success_password_reset'), { variant: 'success' })
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message || t('auth.admin.error_password_reset'), { variant: 'error' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.trim()) {
      resetPasswordMutation.mutate({ id: userId, newPassword })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>{t('auth.admin.reset_password_title')}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label={t('auth.admin.enter_new_password')}
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoFocus
            sx={{ mt: 1 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color='inherit' sx={{ textTransform: 'none', fontWeight: 600 }}>
            {t('auth.common.cancel')}
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={resetPasswordMutation.isPending || !newPassword.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, minWidth: 100 }}
          >
            {resetPasswordMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              t('auth.common.save')
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
