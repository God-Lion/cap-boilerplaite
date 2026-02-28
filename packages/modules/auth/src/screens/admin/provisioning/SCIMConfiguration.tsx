import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  Stack,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { ContentCopy, VpnKey, Save, Refresh, Security, Code, SwapHoriz } from '@mui/icons-material'

export default function SCIMConfiguration() {
  const theme = useTheme()
  const [scimEnabled, setScimEnabled] = useState(true)
  const scimUrl = 'https://api.startup.com/v2/scim'

  const [mappings, setMappings] = useState([
    { scim: 'userName', internal: 'email', required: true },
    { scim: 'name.givenName', internal: 'firstName', required: true },
    { scim: 'name.familyName', internal: 'lastName', required: true },
    { scim: 'displayName', internal: 'fullName', required: false },
    { scim: 'emails.value', internal: 'secondaryEmail', required: false },
    { scim: 'active', internal: 'status', required: true },
  ])

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>
          SCIM 2.0 Configuration
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Configure inbound provisioning to automate user lifecycle management across your
          enterprise.
        </Typography>
      </Box>

      {/* Main Configuration */}
      <Stack spacing={3}>
        <Card
          sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
            >
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 800 }}>
                  Protocol Status
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Enable or disable SCIM endpoints for this organization.
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={scimEnabled}
                    onChange={(e) => setScimEnabled(e.target.checked)}
                    color='primary'
                  />
                }
                label={scimEnabled ? 'Enabled' : 'Disabled'}
                sx={{ '& .MuiTypography-root': { fontWeight: 700 } }}
              />
            </Box>

            <Box sx={{ opacity: scimEnabled ? 1 : 0.5, transition: 'opacity 0.2s' }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 800, mb: 2 }}>
                SCIM BASE URL
              </Typography>
              <TextField
                fullWidth
                value={scimUrl}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Code sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton size='small'>
                        <ContentCopy fontSize='inherit' />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 4 }}
              />

              <Typography variant='subtitle2' sx={{ fontWeight: 800, mb: 1 }}>
                AUTHENTICATION TOKEN
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Use this Bearer token to authenticate requests from your Identity Provider (Okta,
                Azure AD, etc).
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <Stack direction='row' spacing={2} alignItems='center'>
                  <VpnKey sx={{ color: 'primary.main' }} />
                  <Typography
                    variant='body2'
                    component='code'
                    sx={{ fontWeight: 600, fontFamily: 'Monospace' }}
                  >
                    scim_live_••••••••••••••••••••••••••
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <Button
                    size='small'
                    startIcon={<Refresh />}
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Rotate
                  </Button>
                  <IconButton>
                    <ContentCopy fontSize='small' />
                  </IconButton>
                </Stack>
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* Attribute Mapping */}
        <Card
          sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 800 }}>
                  Attribute Mapping
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Map SCIM 2.0 standard attributes to internal profile fields.
                </Typography>
              </Box>
              <Button startIcon={<SwapHoriz />} sx={{ fontWeight: 700, textTransform: 'none' }}>
                Reset Defaults
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Table size='small'>
                <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, py: 1.5 }}>SCIM ATTRIBUTE</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 900 }}>
                      MAPPING
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>INTERNAL FIELD</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mappings.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {row.scim}
                          </Typography>
                          {row.required && (
                            <Chip
                              label='Required'
                              size='small'
                              variant='filled'
                              color='error'
                              sx={{
                                height: 16,
                                fontSize: '0.6rem',
                                fontWeight: 900,
                                bgcolor: alpha(theme.palette.error.main, 0.15),
                                color: 'error.main',
                              }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align='center'>
                        <SwapHoriz sx={{ color: 'text.disabled', fontSize: 18 }} />
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          fullWidth
                          size='small'
                          value={row.internal}
                          SelectProps={{ native: true }}
                          sx={{ '& select': { py: 0.5, fontWeight: 700, fontSize: '0.875rem' } }}
                        >
                          <option value={row.internal}>{row.internal}</option>
                          <option value='other'>other</option>
                        </TextField>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant='outlined'
                startIcon={<Security />}
                sx={{ px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
              >
                Test Configuration
              </Button>
              <Button
                variant='contained'
                startIcon={<Save />}
                sx={{ px: 4, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}
