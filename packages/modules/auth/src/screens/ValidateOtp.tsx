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
import { LockOpenOutlined } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import OtpInput from 'react-otp-input'
import { useTranslation } from 'react-i18next'
import { themeConfig, AdaptiveLogo } from '@cap/platform-core'
import { useForm, Controller } from 'react-hook-form'

interface OtpFormData {
  otp: string
}

export default function ValidateOtp() {
  const { t } = useTranslation()

  const { control, handleSubmit } = useForm<OtpFormData>({
    defaultValues: {
      otp: '',
    },
  })

  const onSubmit = (data: OtpFormData) => {
    console.log('OTP Submitted:', data)
  }

  return (
    <React.Fragment>
      <title>
        {t('auth.otp.title_page')} - {themeConfig.templateName}
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
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                opacity: 0.1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LockOpenOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography
              component='h1'
              variant='h4'
              sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}
            >
              {t('auth.otp.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' align='center' sx={{ mb: 6 }}>
              {t('auth.otp.desc')}
            </Typography>

            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: '100%' }}
            >
              <Controller
                name='otp'
                control={control}
                rules={{ required: true, minLength: 4 }}
                render={({ field: { value, onChange } }) => (
                  <OtpInput
                    value={value}
                    onChange={onChange}
                    numInputs={4}
                    containerStyle={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1rem',
                      marginBottom: '2rem',
                    }}
                    inputStyle={{
                      width: '3.5rem',
                      height: '4rem',
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
                {t('auth.otp.button_verify')}
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Typography variant='body2' color='text.secondary'>
                  {t('auth.otp.no_code_help')}
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
                  {t('auth.otp.button_resend')}
                </MuiLink>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </React.Fragment>
  )
}
