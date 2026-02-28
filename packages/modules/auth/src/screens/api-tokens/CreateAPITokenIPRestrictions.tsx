import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Link,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Paper,
  Tooltip,
} from '@mui/material'
import {
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Language as GlobeIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from '../path'

const CreateAPITokenIPRestrictions: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [ipInput, setIpInput] = useState('')
  const [ipList, setIpList] = useState<string[]>([])

  const handleAddIP = () => {
    if (ipInput && !ipList.includes(ipInput)) {
      setIpList([...ipList, ipInput])
      setIpInput('')
    }
  }

  const handleRemoveIP = (ip: string) => {
    setIpList(ipList.filter((item) => item !== ip))
  }

  const handleNext = () => {
    navigate(Path.apiTokens.display)
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
        {t('api_tokens:restrictions_header', 'Add IP Restrictions')}
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
        {t(
          'api_tokens:restrictions_subheader',
          'Limit access to your token for improved security (optional).',
        )}
      </Typography>

      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={1} alternativeLabel>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant='subtitle1' fontWeight='bold'>
                {t('api_tokens:ip_whitelist', 'Allowed IP Addresses')}
              </Typography>
              <Tooltip
                title={t(
                  'api_tokens:ip_help',
                  'Support individual IPs (e.g. 1.2.3.4) or CIDR blocks (e.g. 1.2.3.0/24)',
                )}
              >
                <IconButton size='small' sx={{ ml: 1 }}>
                  <InfoIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              {t(
                'api_tokens:ip_whitelist_desc',
                'Requests from IP addresses not in this list will be rejected. Leave empty to allow any IP address.',
              )}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                placeholder={t('api_tokens:ip_placeholder', 'e.g. 192.168.1.1 or 10.0.0.0/16')}
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddIP()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <GlobeIcon fontSize='small' />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={handleAddIP}
                disabled={!ipInput}
              >
                {t('common:add', 'Add')}
              </Button>
            </Box>

            <Paper variant='outlined' sx={{ borderRadius: 2, minHeight: 120 }}>
              {ipList.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    height: '100%',
                  }}
                >
                  <GlobeIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography variant='body2' color='text.secondary'>
                    {t('api_tokens:no_restrictions', 'No IP restrictions added yet.')}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {ipList.map((ip, index) => (
                    <React.Fragment key={ip}>
                      <ListItem>
                        <ListItemText primary={ip} />
                        <ListItemSecondaryAction>
                          <IconButton edge='end' onClick={() => handleRemoveIP(ip)} color='error'>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < ipList.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: 'warning.lighter',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'warning.main',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <SecurityIcon color='warning' sx={{ mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant='subtitle2' color='warning.contrastText'>
                {t('api_tokens:security_warning_title', 'Security Recommendation')}
              </Typography>
              <Typography variant='body2' color='warning.contrastText'>
                {t(
                  'api_tokens:security_warning_msg',
                  'For production environments, we strongly recommend restricting API tokens to the IP addresses of your servers.',
                )}
              </Typography>
            </Box>
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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(Path.apiTokens.create_basic)}
          >
            {t('common:back', 'Back')}
          </Button>
          <Box>
            <Button variant='text' sx={{ mr: 2 }} onClick={handleNext}>
              {t('api_tokens:skip_restrictions', 'Skip for now')}
            </Button>
            <Button variant='contained' endIcon={<NavigateNextIcon />} onClick={handleNext}>
              {t('api_tokens:generate_token', 'Generate Token')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default CreateAPITokenIPRestrictions
