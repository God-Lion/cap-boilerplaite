import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useUsers, useBanUser } from '../../hooks/useAdminQuery'
import { useSnackbar } from 'notistack'
import { useDebounce } from 'use-debounce'

interface IssueBanDialogProps {
  open: boolean
  onClose: () => void
}

export default function IssueBanDialog({ open, onClose }: IssueBanDialogProps) {
  const { t } = useTranslation('common')
  const { enqueueSnackbar } = useSnackbar()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch] = useDebounce(searchTerm, 300)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [reason, setReason] = useState('')

  const { data: userData, isLoading: isUsersLoading } = useUsers({
    search: debouncedSearch,
    limit: 10,
  })

  const banMutation = useBanUser({
    onSuccess: () => {
      enqueueSnackbar(t('auth.admin.ban_success'), {
        variant: 'success',
      })
      onClose()
      setSelectedUser(null)
      setReason('')
    },
    onError: (error) => {
      enqueueSnackbar(error.message || t('auth.common.error_occurred'), {
        variant: 'error',
      })
    },
  })

  const handleIssueBan = () => {
    if (selectedUser) {
      banMutation.mutate({ id: selectedUser.id, reason })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>{t('auth.admin.issue_new_ban')}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <Autocomplete
            options={userData?.data?.data || []}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            loading={isUsersLoading}
            onInputChange={(_, value) => setSearchTerm(value)}
            onChange={(_, value) => setSelectedUser(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('auth.admin.select_user')}
                placeholder={t('auth.admin.search_user_to_ban')}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isUsersLoading ? <CircularProgress color='inherit' size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />

          {selectedUser && selectedUser.status === 'SUSPENDED' && (
            <Alert severity='warning'>{t('auth.admin.user_already_banned')}</Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('auth.admin.ban_reason')}
            placeholder={t('auth.admin.ban_reason_placeholder')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color='inherit' sx={{ textTransform: 'none', fontWeight: 600 }}>
          {t('auth.common.cancel')}
        </Button>
        <Button
          onClick={handleIssueBan}
          variant='contained'
          color='error'
          disabled={!selectedUser || banMutation.isPending || selectedUser.status === 'SUSPENDED'}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {banMutation.isPending ? <CircularProgress size={24} /> : t('auth.admin.issue_ban')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
