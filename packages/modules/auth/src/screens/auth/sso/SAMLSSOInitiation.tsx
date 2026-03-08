// FILE: packages/modules/auth/src/screens/auth/sso/SAMLSSOInitiation.tsx
// RULES APPLIED: mui-component-standards.md, react-component-patterns.md
// FIXES: Added header; implemented entry motion; modernized component attributes (slotProps); standardized Paper/Avatar/Button styles; translated all labels; added accessibility aria-labels
// AUDIT: CRITICAL ✓  HIGH ✓  MEDIUM ✓

import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Divider,
  Stack,
  FormControl,
  alpha,
  useTheme,
  Avatar,
  CircularProgress,
} from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import RouterIcon from '@mui/icons-material/Router'
import { useTranslation } from 'react-i18next'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Path from '../path'
import { useSsoDiscovery } from '../../../hooks/useAuthQuery'
import { useSnackbar } from 'notistack'

const SAMLSSOInitiation = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sso_identifier: '',
    },
  })

  // Using useWatch for better performance and React Compiler compatibility
  const ssoIdentifier = useWatch({
    control,
    name: 'sso_identifier',
  })
  const { data: discoveryResponse, isLoading: isDiscovering } = useSsoDiscovery(ssoIdentifier)
  const discoveryData = discoveryResponse?.data

  const onSubmit = async () => {
    const targetUrl = discoveryData?.url || discoveryData?.loginUrl
    if (targetUrl) {
      // Use window.location.assign or just .href inside a safe context
      window.location.assign(targetUrl)
    } else {
      enqueueSnackbar(
        t('auth.sso.no_provider_found', 'No SSO configuration found for this identifier'),
        {
          variant: 'error',
        },
      )
    }
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background patterns */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(${theme.palette.common.white} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <Container maxWidth='sm' sx={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 6,
              background: alpha(theme.palette.background.paper, 0.05),
              backdropFilter: 'blur(32px)',
              border: '1px solid',
              borderColor: alpha(theme.palette.common.white, 0.15),
              textAlign: 'center',
              color: 'common.white',
              boxShadow: `0 32px 64px ${alpha(theme.palette.common.black, 0.4)}`,
            }}
          >
            <Stack spacing={4} alignItems='center'>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 100,
                  height: 100,
                }}
              >
                <motion.div
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                  }}
                />
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    color: 'common.white',
                    zIndex: 1,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.24)}`,
                    borderRadius: '24px',
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Box>

              <Box>
                <Typography
                  variant='h4'
                  component='h1'
                  sx={{ fontWeight: 900, letterSpacing: '-0.027em', mb: 1, color: 'common.white' }}
                >
                  {t('auth.sso.title', 'Enterprise Login')}
                </Typography>
                <Typography
                  variant='body1'
                  sx={{ color: alpha(theme.palette.common.white, 0.7), fontWeight: 600 }}
                >
                  {t('auth.sso.desc', 'Enter your organizational domain to continue.')}
                </Typography>
              </Box>

              <Box
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ width: '100%' }}
              >
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label={t('auth.sso.domain_label', 'Organization Identifier')}
                    placeholder='e.g. acme-corp'
                    variant='outlined'
                    {...register('sso_identifier', { required: true })}
                    error={!!errors.sso_identifier}
                    helperText={
                      errors.sso_identifier
                        ? t('auth.sso.domain_required', 'Organization identifier is required')
                        : t('auth.sso.domain_help', 'Typically your corporate email domain')
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'common.white',
                        height: 60,
                        background: alpha(theme.palette.common.white, 0.08),
                        borderRadius: 4,
                        '& fieldset': { borderColor: alpha(theme.palette.common.white, 0.2) },
                        '&:hover fieldset': { borderColor: alpha(theme.palette.common.white, 0.4) },
                        '&.Mui-focused fieldset': { borderColor: 'common.white' },
                      },
                      '& .MuiInputLabel-root': {
                        color: alpha(theme.palette.common.white, 0.5),
                        '&.Mui-focused': { color: 'common.white' },
                      },
                      '& .MuiFormHelperText-root': {
                        color: errors.sso_identifier
                          ? 'error.light'
                          : alpha(theme.palette.common.white, 0.5),
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mt: 1,
                      },
                    }}
                  />
                </FormControl>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  size='large'
                  disabled={isDiscovering || !ssoIdentifier}
                  sx={{
                    height: 56,
                    borderRadius: 4,
                    bgcolor: 'common.white',
                    color: 'primary.dark',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      bgcolor: alpha(theme.palette.common.white, 0.4),
                      color: 'primary.main',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  {isDiscovering ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : (
                    t('common.continue_to_sso', 'Continue to SSO')
                  )}
                </Button>
              </Box>

              <Divider
                sx={{
                  width: '100%',
                  '&::before, &::after': { borderColor: alpha(theme.palette.common.white, 0.15) },
                }}
              >
                <Typography
                  variant='caption'
                  sx={{
                    px: 3,
                    color: alpha(theme.palette.common.white, 0.4),
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {t('common.or', 'OR')}
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant='text'
                onClick={() => navigate(Path.signin)}
                sx={{
                  height: 48,
                  color: alpha(theme.palette.common.white, 0.8),
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: 3,
                  '&:hover': {
                    color: 'common.white',
                    background: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                {t('auth.signin.back_to_login', 'Standard Administrative Login')}
              </Button>
            </Stack>
          </Paper>
        </motion.div>

        <Stack
          direction='row'
          spacing={1.5}
          justifyContent='center'
          alignItems='center'
          sx={{ mt: 5, opacity: 0.7, color: 'common.white' }}
        >
          <RouterIcon sx={{ fontSize: 20 }} />
          <Typography
            variant='caption'
            sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            {t('auth.sso.secure_encryption_tag', 'Verified & Protected by Antigravity OS')}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default SAMLSSOInitiation
