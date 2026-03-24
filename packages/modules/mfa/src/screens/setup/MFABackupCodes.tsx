import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Typography, Avatar, Checkbox, FormControlLabel,
  IconButton, Paper, CircularProgress, Alert, alpha, useTheme,
} from '@mui/material'
import { LockReset, ContentCopy, Download, Print, CheckCircle, Refresh, ArrowForward } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRegenerateBackupCodes } from '../../hooks/useMfaQuery'

// Assuming Path is exported or we use direct strings
// import { Path } from '@cap/module-auth' 

export default function MFABackupCodes() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [codes, setCodes] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const regenerateMutation = useRegenerateBackupCodes({
    onSuccess: (response: any) => setCodes(response.data.backup_codes),
    onError: () => setError(t('mfa.generateFailed', 'Failed to generate backup codes.')),
  })

  const handleGenerate = useCallback(() => regenerateMutation.mutate(), [regenerateMutation])

  const handleCopyAll = useCallback(() => {
    if (!codes.length) return
    navigator.clipboard.writeText(codes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [codes])

  const handleDownload = useCallback(() => {
    if (!codes.length) return
    const content = `MFA Backup Codes\n\n${codes.join('\n')}\n\nEach code can only be used once.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'mfa-backup-codes.txt'
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
  }, [codes])

  const handleContinue = useCallback(() => { 
    if (confirmed) {
      // Use direct path or generic success screen
      navigate('/mfa/verification-success')
    }
  }, [confirmed, navigate])

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ width: '100%', maxWidth: 520, mx: 'auto', p: { xs: 3, md: 5 } }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar variant="square"
            sx={{ width: 56, height: 56, bgcolor: 'transparent', color: 'primary.main', borderRadius: '24px', border: '2px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
            <LockReset sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
          {codes.length > 0 ? t('mfa.saveCodes', 'Save your backup codes') : t('mfa.generateCodes', 'Generate backup codes')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 380, mx: 'auto' }}>
          {codes.length > 0 ? t('mfa.codesDesc', 'Keep these codes somewhere safe. Each can only be used once.') : t('mfa.generateDesc', 'Backup codes let you access your account if you lose your device.')}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}>{error}</Alert>}

      {codes.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button fullWidth variant="contained" size="large" startIcon={<Refresh />} onClick={handleGenerate} disabled={regenerateMutation.isPending}
            endIcon={regenerateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : undefined}
            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' } }}>
            {t('mfa.generateButton', 'Generate Backup Codes')}
          </Button>
          <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}>
            {t('common.cancel', 'Cancel')}
          </Button>
        </Box>
      ) : (
        <>
          <Paper elevation={0} sx={{ bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3, position: 'relative', mb: 3, '&:hover .copy-btn': { opacity: 1 } }}>
            <IconButton className="copy-btn" onClick={handleCopyAll} size="small"
              sx={{ position: 'absolute', top: 8, right: 8, opacity: 0, transition: 'opacity 0.2s', color: copied ? 'success.main' : 'text.secondary', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', '&:hover': { color: 'primary.main' } }}>
              {copied ? <CheckCircle sx={{ fontSize: 18 }} /> : <ContentCopy sx={{ fontSize: 18 }} />}
            </IconButton>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, columnGap: 4 }}>
              {codes.map((code, index) => (
                <Typography key={index} sx={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em', textAlign: { xs: 'center', sm: 'left' } }}>
                  {code}
                </Typography>
              ))}
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            {[
              { label: t('mfa.download', 'Download'), icon: <Download sx={{ fontSize: 20 }} />, action: handleDownload },
              { label: t('mfa.print', 'Print'), icon: <Print sx={{ fontSize: 20 }} />, action: () => window.print() },
            ].map(({ label, icon, action }) => (
              <Button key={label} fullWidth variant="outlined" startIcon={icon} onClick={action}
                sx={{ py: 1, borderRadius: 3, fontWeight: 600, textTransform: 'none', color: 'text.primary', borderColor: alpha(theme.palette.divider, 0.8), '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.5) } }}>
                {label}
              </Button>
            ))}
          </Box>

          <FormControlLabel
            sx={{ width: '100%', m: 0, p: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' }, mb: 3 }}
            control={<Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} sx={{ p: 0, mr: 1.5 }} />}
            label={<Typography variant="body2" sx={{ fontWeight: 500, userSelect: 'none' }}>{t('mfa.confirmSaved', 'I have saved my backup codes in a safe place.')}</Typography>}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button fullWidth variant="contained" size="large" onClick={handleContinue} disabled={!confirmed}
              endIcon={<ArrowForward />}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' } }}>
              {t('mfa.continueDashboard', 'Continue to Dashboard')}
            </Button>
            <Button fullWidth onClick={() => navigate('/dashboard')}
              sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500, '&:hover': { color: 'text.primary' } }}>
              {t('account.setupLater', 'Set up later')}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
