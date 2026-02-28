import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from '../path'

const APITokenDisplayUsage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  // Mock generated token
  const generatedToken = 'cap_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDone = () => {
    navigate(Path.apiTokens.dashboard)
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant='h4' fontWeight='bold' gutterBottom textAlign='center'>
        {t('api_tokens:display_header', 'Token Generated Successfully!')}
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }} textAlign='center'>
        {t(
          'api_tokens:display_subheader',
          "Make sure to copy your API token now. You won't be able to see it again!",
        )}
      </Typography>

      <Alert severity='warning' sx={{ mb: 4, borderRadius: 2 }}>
        <AlertTitle sx={{ fontWeight: 'bold' }}>
          {t('api_tokens:security_alert_title', 'Crucial Security Warning')}
        </AlertTitle>
        {t(
          'api_tokens:security_alert_msg',
          'For your security, we only show this token once. Store it in a secure password manager or environment variable.',
        )}
      </Alert>

      <Card variant='outlined' sx={{ borderRadius: 3, mb: 4, bgcolor: 'action.hover' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant='subtitle2' color='text.secondary' gutterBottom>
            {t('api_tokens:your_new_token', 'Your New API Token')}
          </Typography>
          <Paper
            variant='outlined'
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'background.paper',
              borderRadius: 2,
              fontFamily: 'monospace',
              fontSize: '1rem',
              wordBreak: 'break-all',
            }}
          >
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              {showSecret ? generatedToken : generatedToken.replace(/.(?=.{4})/g, '*')}
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Tooltip title={showSecret ? t('common:hide') : t('common:show')}>
                <IconButton size='small' onClick={() => setShowSecret(!showSecret)} sx={{ mr: 1 }}>
                  {showSecret ? (
                    <VisibilityOffIcon fontSize='small' />
                  ) : (
                    <VisibilityIcon fontSize='small' />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title={copied ? t('common:copied') : t('common:copy')}>
                <IconButton
                  size='small'
                  onClick={handleCopy}
                  color={copied ? 'success' : 'primary'}
                >
                  {copied ? <CheckIcon fontSize='small' /> : <CopyIcon fontSize='small' />}
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </CardContent>
      </Card>

      <Box sx={{ mb: 4 }}>
        <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
          {t('api_tokens:how_to_use', 'How to use this token')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {t(
            'api_tokens:usage_desc',
            'Include this token in the Authorization header of your API requests.',
          )}
        </Typography>
        <Paper
          variant='outlined'
          sx={{
            p: 2,
            bgcolor: 'grey.900',
            color: 'grey.100',
            borderRadius: 2,
            fontFamily: 'monospace',
            fontSize: '0.85rem',
          }}
        >
          <Box component='pre' sx={{ m: 0, whitespace: 'pre-wrap' }}>
            curl -H &quot;Authorization: Bearer {generatedToken.substring(0, 12)}...&quot; \
            https://api.myapp.com/v1/profile
          </Box>
        </Paper>
      </Box>

      <Button
        fullWidth
        variant='contained'
        size='large'
        endIcon={<ArrowForwardIcon />}
        onClick={handleDone}
        sx={{ py: 1.5, borderRadius: 2 }}
      >
        {t('api_tokens:done_and_dashboard', 'I have copied it, take me to Dashboard')}
      </Button>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          startIcon={<SecurityIcon />}
          variant='text'
          size='small'
          onClick={() => navigate(Path.apiTokens.security_warning)}
        >
          {t('api_tokens:view_security_guide', 'View Token Security Guide')}
        </Button>
      </Box>
    </Box>
  )
}

export default APITokenDisplayUsage
