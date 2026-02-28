import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Select,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material'
import {
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from '../path'

const CreateAPITokenBasicInfo: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tokenName, setTokenName] = useState('')
  const [expiration, setExpiration] = useState('30_days')

  const scopes = [
    { id: 'read:profile', label: 'Read Profile', description: 'Access basic profile information' },
    {
      id: 'write:profile',
      label: 'Write Profile',
      description: 'Update profile and account settings',
    },
    { id: 'read:users', label: 'Read Users', description: 'List and view user details' },
    { id: 'write:users', label: 'Write Users', description: 'Create and manage users' },
    { id: 'read:audit', label: 'Read Audit Logs', description: 'View security and system logs' },
  ]

  const [selectedScopes, setSelectedScopes] = useState<string[]>([])

  const handleToggleScope = (id: string) => {
    setSelectedScopes((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const handleNext = () => {
    navigate(Path.apiTokens.create_restrictions)
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} sx={{ mb: 3 }}>
        <Link
          underline='hover'
          color='inherit'
          onClick={() => navigate(Path.apiTokens.dashboard)}
          sx={{ cursor: 'pointer' }}
        >
          {t('api_tokens:title', 'API Tokens')}
        </Link>
        <Typography color='text.primary'>
          {t('api_tokens:create_title', 'Create New Token')}
        </Typography>
      </Breadcrumbs>

      <Typography variant='h4' fontWeight='bold' gutterBottom>
        {t('api_tokens:create_header', 'Create a new API Token')}
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
        {t('api_tokens:create_subheader', 'Basic information and permissions for your token.')}
      </Typography>

      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={0} alternativeLabel>
          <Step>
            <StepLabel>{t('api_tokens:step_basic', 'Basic Info')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('api_tokens:step_restrictions', 'IP Restrictions')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('api_tokens:step_review', 'Review & Generate')}</StepLabel>
          </Step>
        </Stepper>
      </Box>

      <Card variant='outlined' sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <FormLabel component='legend' sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
              {t('api_tokens:field_name', 'Token Name')}
            </FormLabel>
            <TextField
              fullWidth
              placeholder={t('api_tokens:name_placeholder', 'e.g. My Website Backend')}
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              variant='outlined'
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <FormLabel component='legend' sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
              {t('api_tokens:field_expiration', 'Expiration Period')}
            </FormLabel>
            <Select fullWidth value={expiration} onChange={(e) => setExpiration(e.target.value)}>
              <MenuItem value='7_days'>7 Days</MenuItem>
              <MenuItem value='30_days'>30 Days</MenuItem>
              <MenuItem value='90_days'>90 Days</MenuItem>
              <MenuItem value='1_year'>1 Year</MenuItem>
              <MenuItem value='never'>Never (Not Recommended)</MenuItem>
            </Select>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <SecurityIcon sx={{ mr: 1, fontSize: 20 }} color='primary' />
              {t('api_tokens:permissions_title', 'Scopes & Permissions')}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              {t(
                'api_tokens:permissions_help',
                'Select the minimal permissions required for this token.',
              )}
            </Typography>

            <FormGroup sx={{ gap: 2 }}>
              {scopes.map((scope) => (
                <Paper
                  key={scope.id}
                  variant='outlined'
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderColor: selectedScopes.includes(scope.id) ? 'primary.main' : 'divider',
                  }}
                  onClick={() => handleToggleScope(scope.id)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedScopes.includes(scope.id)}
                        onChange={() => handleToggleScope(scope.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body2' fontWeight='bold'>
                          {scope.label}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {scope.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', ml: 0 }}
                  />
                </Paper>
              ))}
            </FormGroup>
          </Box>
        </CardContent>

        <Box
          sx={{
            px: 4,
            py: 3,
            bgcolor: 'action.hover',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(Path.apiTokens.dashboard)}>
            {t('common:cancel', 'Cancel')}
          </Button>
          <Button
            variant='contained'
            endIcon={<NavigateNextIcon />}
            onClick={handleNext}
            disabled={!tokenName || selectedScopes.length === 0}
          >
            {t('common:continue', 'Continue')}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default CreateAPITokenBasicInfo
