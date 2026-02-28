import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material'
import { Mail, Info, ArrowForward, ArrowBack, HelpOutline } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const RequestEmailChange = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')

  return (
    <Container maxWidth='sm' sx={{ py: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant='h5' fontWeight='bold'>
          {t('auth.account.request_email_change_title', 'Change Email Address')}
        </Typography>
      </Box>

      <Paper variant='outlined' sx={{ p: { xs: 3, sm: 6 }, borderRadius: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Mail sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            {t('auth.account.update_email_address', 'Update your email address')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t(
              'auth.account.update_email_address_desc',
              'Update your email address to manage your account security.',
            )}
          </Typography>
        </Box>

        <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant='subtitle2' fontWeight='bold' sx={{ mb: 1 }}>
              {t('auth.account.new_email_label', 'New Email Address')}
            </Typography>
            <TextField
              fullWidth
              placeholder={t('auth.account.new_email_placeholder', 'Enter new email address')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Mail sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant='subtitle2' fontWeight='bold' sx={{ mb: 1 }}>
              {t('auth.account.reason_for_change', 'Reason for change (Optional)')}
            </Typography>
            <FormControl fullWidth>
              <Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                displayEmpty
                renderValue={
                  reason !== ''
                    ? undefined
                    : () => <Typography color='text.disabled'>Select a reason</Typography>
                }
              >
                <MenuItem value='security'>
                  {t('auth.account.security_reasons', 'Security concerns')}
                </MenuItem>
                <MenuItem value='personal'>
                  {t('auth.account.personal_reasons', 'Changing personal email')}
                </MenuItem>
                <MenuItem value='work'>
                  {t('auth.account.work_reasons', 'Switching to work email')}
                </MenuItem>
                <MenuItem value='other'>{t('auth.account.other_reasons', 'Other')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: 'info.lighter',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'info.light',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <Info color='info' sx={{ mr: 1.5, mt: 0.2, fontSize: 20 }} />
            <Box>
              <Typography variant='subtitle2' fontWeight='bold' color='info.main'>
                {t('auth.account.verification_required', 'Verification Required')}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {t(
                  'auth.account.verification_required_desc',
                  'For security reasons, we will send a verification link to your new email address. You must click the link to finalize the change.',
                )}
              </Typography>
            </Box>
          </Box>

          <Button
            variant='contained'
            fullWidth
            size='large'
            endIcon={<ArrowForward />}
            sx={{
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
            {t('auth.account.submit_request', 'Submit Request')}
          </Button>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Privacy Policy
          </Typography>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Terms of Service
          </Typography>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <HelpOutline sx={{ fontSize: 14, mr: 0.5 }} />
            Contact Support
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default RequestEmailChange
