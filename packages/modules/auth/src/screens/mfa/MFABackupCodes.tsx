import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  CircularProgress,
  Backdrop,
} from '@mui/material'
import { LockReset, ContentCopy, Download, Print, CheckCircle, Refresh } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import { useRegenerateBackupCodes } from '../../hooks/useAuthQuery'
import Path from '../path'

/**
 * MFA Backup Codes Display Component (V2)
 *
 * High-fidelity conversion of Stitch design to React + MUI.
 * Follows established project patterns for authentication screens.
 *
 * Features:
 * - Backup code generation and display
 * - Copy, download, and print functionality
 * - User confirmation before proceeding
 * - Responsive layout with mobile support
 */
export default function MFABackupCodes() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [codes, setCodes] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)

  const regenerateMutation = useRegenerateBackupCodes({
    onSuccess: (response) => {
      setCodes(response.data.backup_codes)
    },
  })

  const handleGenerate = useCallback(() => {
    regenerateMutation.mutate()
  }, [regenerateMutation])

  const handleCopyAll = useCallback(() => {
    if (!codes.length) return
    const allCodes = codes.join('\n')
    navigator.clipboard.writeText(allCodes)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [codes])

  const handleDownload = useCallback(() => {
    if (!codes.length) return
    const content = `MFA Backup Codes\n\n${codes.join('\n')}\n\nKeep these codes in a safe place. Each code can only be used once.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mfa-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [codes])

  const handlePrint = useCallback(() => {
    if (!codes.length) return
    const printWindow = window.open('', '', 'height=600,width=800')
    if (printWindow) {
      printWindow.document.write('<html><head><title>MFA Backup Codes</title>')
      printWindow.document.write('<style>')
      printWindow.document.write(
        'body { font-family: monospace; padding: 40px; } h1 { margin-bottom: 20px; } .codes { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 30px 0; } .code { font-size: 16px; font-weight: bold; }',
      )
      printWindow.document.write('</style></head><body>')
      printWindow.document.write('<h1>MFA Backup Codes</h1>')
      printWindow.document.write('<div class="codes">')
      codes.forEach((code) => {
        printWindow.document.write(`<div class="code">${code}</div>`)
      })
      printWindow.document.write('</div>')
      printWindow.document.write(
        '<p style="margin-top: 40px;">Keep these codes in a safe place. Each code can only be used once.</p>',
      )
      printWindow.document.write('</body></html>')
      printWindow.document.close()
      printWindow.print()
    }
  }, [codes])

  const handleContinue = useCallback(() => {
    if (confirmed) {
      navigate(Path.mfa.verification_success)
    }
  }, [confirmed, navigate])

  const handleSetupLater = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])

  return (
    <>
      <title>
        {t('auth.mfa.backup_codes')} - {themeConfig.templateName}
      </title>

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          fontFamily: "'Inter', sans-serif",
          bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f6f7f8' : '#101922'),
        }}
      >
        <Backdrop
          open={regenerateMutation.isPending}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>

        {/* Header / Nav (Mobile only if needed, otherwise matches login flow) */}
        <Box
          component='header'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 3, sm: 5 },
            py: 2,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
              }}
            >
              <LockReset sx={{ fontSize: 30 }} />
            </Box>
            <Typography
              variant='h6'
              sx={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.015em' }}
            >
              SecureApp
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 3 },
            overflow: 'auto',
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '12px',
              boxShadow: (theme) =>
                theme.palette.mode === 'light'
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  : '0 0 15px rgba(19, 127, 236, 0.15)',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Header Content */}
              <Box
                sx={{
                  p: { xs: 4, sm: 5 },
                  pb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light' ? 'blue.50' : 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    color: 'primary.main',
                  }}
                >
                  <LockReset sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  variant='h1'
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                    letterSpacing: '-0.025em',
                  }}
                >
                  {codes.length > 0 ? t('auth.mfa.save_codes') : t('auth.mfa.generate_codes')}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    maxWidth: '380px',
                    lineHeight: 1.6,
                    px: 3,
                  }}
                >
                  {codes.length > 0 ? t('auth.mfa.codes_desc') : t('auth.mfa.generate_desc')}
                </Typography>
              </Box>

              {/* Codes View */}
              {codes.length === 0 ? (
                <Box
                  sx={{
                    px: { xs: 4, sm: 5 },
                    py: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Button
                    fullWidth
                    variant='contained'
                    size='large'
                    startIcon={<Refresh />}
                    onClick={handleGenerate}
                    disabled={regenerateMutation.isPending}
                    sx={{
                      height: 48,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 700,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {t('auth.mfa.generate_button')}
                  </Button>
                  <Button
                    onClick={() => navigate(-1)}
                    sx={{
                      textTransform: 'none',
                      color: 'text.secondary',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {t('auth.common.cancel')}
                  </Button>
                </Box>
              ) : (
                <>
                  {/* Backup Codes Grid */}
                  <Box sx={{ px: { xs: 4, sm: 5 }, py: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light' ? '#f8fafc' : '#0d141c',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        p: 3,
                        position: 'relative',
                        '&:hover .copy-button': {
                          opacity: 1,
                        },
                      }}
                    >
                      {/* Copy Hint */}
                      <IconButton
                        className='copy-button'
                        onClick={handleCopyAll}
                        size='small'
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          color: copied ? 'success.main' : 'text.secondary',
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            bgcolor: 'background.paper',
                            color: 'primary.main',
                          },
                        }}
                        title={t('auth.mfa.copy_all')}
                      >
                        {copied ? (
                          <CheckCircle sx={{ fontSize: 18 }} />
                        ) : (
                          <ContentCopy sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 1.5,
                          columnGap: 4,
                        }}
                      >
                        {codes.map((code, index) => (
                          <Typography
                            key={index}
                            sx={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: '1rem',
                              fontWeight: 500,
                              color: 'text.primary',
                              whiteSpace: 'nowrap',
                              letterSpacing: '0.05em',
                              textAlign: { xs: 'center', sm: 'left' },
                            }}
                          >
                            {code}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  </Box>

                  {/* Actions (Download/Print) */}
                  <Box
                    sx={{
                      px: { xs: 4, sm: 5 },
                      py: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 1.5,
                    }}
                  >
                    <Button
                      fullWidth
                      variant='outlined'
                      startIcon={<Download sx={{ fontSize: 20 }} />}
                      onClick={handleDownload}
                      sx={{
                        height: 40,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'text.primary',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'light' ? '#f1f5f9' : 'rgba(255,255,255,0.05)',
                          borderColor: 'divider',
                        },
                      }}
                    >
                      {t('auth.mfa.download')}
                    </Button>
                    <Button
                      fullWidth
                      variant='outlined'
                      startIcon={<Print sx={{ fontSize: 20 }} />}
                      onClick={handlePrint}
                      sx={{
                        height: 40,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'text.primary',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'light' ? '#f1f5f9' : 'rgba(255,255,255,0.05)',
                          borderColor: 'divider',
                        },
                      }}
                    >
                      {t('auth.mfa.print')}
                    </Button>
                  </Box>

                  {/* Confirmation Checkbox */}
                  <Box sx={{ px: { xs: 4, sm: 5 }, py: 1 }}>
                    <FormControlLabel
                      sx={{
                        width: '100%',
                        m: 0,
                        p: 1.5,
                        borderRadius: '8px',
                        '&:hover': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'light' ? '#f1f5f9' : 'rgba(255,255,255,0.02)',
                        },
                        transition: 'background-color 0.2s',
                        cursor: 'pointer',
                      }}
                      control={
                        <Checkbox
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                          sx={{
                            p: 0,
                            mr: 1.5,
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 500, color: 'text.primary', userSelect: 'none' }}
                        >
                          {t('auth.mfa.confirm_saved')}
                        </Typography>
                      }
                    />
                  </Box>

                  {/* Footer Action */}
                  <Box sx={{ p: { xs: 4, sm: 5 }, pt: 1, pb: 5 }}>
                    <Button
                      fullWidth
                      variant='contained'
                      size='large'
                      onClick={handleContinue}
                      disabled={!confirmed}
                      sx={{
                        height: 48,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: 'none',
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      {t('auth.mfa.continue_dashboard')}
                    </Button>

                    <Button
                      fullWidth
                      onClick={handleSetupLater}
                      sx={{
                        mt: 2,
                        textTransform: 'none',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: 'text.primary',
                        },
                      }}
                    >
                      {t('auth.account.setup_later')}
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  )
}
