import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Avatar, Stack, LinearProgress, alpha, useTheme } from '@mui/material';
import { Lock, LinkOff, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type VerificationState = 'loading' | 'expired'

const PasswordlessVerification = () => {
  const { t } = useTranslation('common')
  const theme = useTheme()
  const [state, setState] = useState<VerificationState>('loading')
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setState('expired'), 500)
          return 100
        }
        return prev + 5
      })
    }, 100)
    return () => clearInterval(timer)
  }, [])

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ width: '100%', maxWidth: 440, mx: 'auto', p: { xs: 3, md: 5 }, textAlign: 'center' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Avatar variant="square"
          sx={{ width: 56, height: 56, bgcolor: 'transparent', borderRadius: '24px', border: '2px solid',
            color: state === 'expired' ? 'error.main' : 'primary.main',
            borderColor: alpha(state === 'expired' ? theme.palette.error.main : theme.palette.primary.main, 0.2) }}>
          {state === 'expired' ? <LinkOff sx={{ fontSize: 32 }} /> : <Lock sx={{ fontSize: 32 }} />}
        </Avatar>
      </Box>

      {state === 'loading' && (
        <>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
            {t('auth.passwordless.verifying_title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 4, lineHeight: 1.6 }}>
            {t('auth.passwordless.verifying_desc')}
          </Typography>
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
                {t('auth.passwordless.securing_session')}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>{progress}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress}
              sx={{ height: 8, borderRadius: '999px', bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { borderRadius: '999px' } }} />
          </Box>
        </>
      )}

      {state === 'expired' && (
        <>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
            {t('auth.passwordless.link_expired')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 4, lineHeight: 1.6 }}>
            {t('auth.passwordless.link_expired_desc')}
          </Typography>
          <Stack spacing={2}>
            <Button fullWidth variant="contained" endIcon={<ArrowForward />}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' } }}>
              {t('auth.passwordless.resend_link')}
            </Button>
            <Button fullWidth variant="text" onClick={() => navigate(-1)}
              sx={{ py: 1.2, fontWeight: 600, color: 'text.secondary', textTransform: 'none', '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.5) } }}>
              {t('common.backToLogin')}
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}

export default PasswordlessVerification
