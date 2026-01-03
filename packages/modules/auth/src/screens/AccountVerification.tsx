import React from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import OtpInput from 'react-otp-input'
import { useTranslation } from 'react-i18next'
import { themeConfig, AdaptiveLogo } from '@cap/platform-core'
import { useForm, Controller } from 'react-hook-form'

interface AccountVerificationFormData {
  otp: string
}

const AccountVerification: React.FC = () => {
  const { t } = useTranslation()

  const { control, handleSubmit } = useForm<AccountVerificationFormData>({
    defaultValues: {
      otp: '',
    },
  })

  const onSubmit = (data: AccountVerificationFormData) => {
    console.log('Account Verification OTP Submitted:', data)
  }

  return (
    <React.Fragment>
      <title>
        {t('auth.account_verification.title_page')} - {themeConfig.templateName}
      </title>

      <Container
        component='main'
        maxWidth='sm'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 450,
            borderRadius: 2,
          }}
        >
          <CardContent
            sx={{
              padding: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ mb: 6 }}>
              <AdaptiveLogo />
            </Box>

            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography component='h1' variant='h4' sx={{ mb: 1, fontWeight: 'bold' }}>
                {t('auth.account_verification.title')}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {t('auth.account_verification.desc')}
              </Typography>
            </Box>

            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: '100%' }}
            >
              <Controller
                name='otp'
                control={control}
                rules={{ required: true, minLength: 6 }}
                render={({ field: { value, onChange } }) => (
                  <OtpInput
                    value={value}
                    onChange={onChange}
                    numInputs={6}
                    containerStyle={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginBottom: '2rem',
                    }}
                    inputStyle={{
                      width: '3rem',
                      height: '3.5rem',
                      fontSize: '1.5rem',
                      textAlign: 'center',
                      borderRadius: '0.5rem',
                      border: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'transparent',
                      outline: 'none',
                    }}
                    renderInput={(props) => <input {...props} />}
                  />
                )}
              />
              <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                <Button
                  type='submit'
                  variant='contained'
                  fullWidth
                  size='large'
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 4,
                  }}
                >
                  {t('auth.account_verification.button_verify')}
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Typography variant='body2' color='text.secondary' align='center'>
                    {t('auth.account_verification.no_code_help') || "Didn't get the code?"}
                  </Typography>
                  <MuiLink
                    component={RouterLink}
                    to='#'
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    {t('auth.account_verification.no_code') || 'Resend'}
                  </MuiLink>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default AccountVerification
