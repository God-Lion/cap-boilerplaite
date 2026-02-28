import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  alpha,
  useTheme,
  Stack,
  Switch,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  InputAdornment,
} from '@mui/material'
import {
  Save,
  ArrowBack,
  Security,
  ContentCopy,
  Refresh,
  Info,
  Code,
  Web,
  Smartphone,
  Router,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useOIDCClient, useUpdateOIDCClient } from '../../../hooks/useAdminQuery'
import Path from '../path'

export default function ApplicationDetailView() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { id } = useParams()
  const { data: clientResponse, isLoading } = useOIDCClient(id)
  const updateMutation = useUpdateOIDCClient()
  const [tab, setTab] = useState(0)

  if (isLoading) return <Box>Loading...</Box>
  const appData = clientResponse?.data
  if (!appData) return <Box>Not Found</Box>

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spa':
        return <Web />
      case 'native':
        return <Smartphone />
      case 'service':
        return <Router />
      default:
        return <Code />
    }
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Dynamic Header Block */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderBottom: '1px solid',
          borderColor: 'divider',
          pt: 4,
          mb: 4,
        }}
      >
        <Container maxWidth='lg'>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(Path.applications)}
            sx={{ mb: 2, color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
          >
            Back to Applications
          </Button>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pb: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                {getTypeIcon(appData.type)}
              </Avatar>
              <Box>
                <Typography
                  variant='h4'
                  sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.02em' }}
                >
                  {appData.client_name}
                </Typography>
                <Stack direction='row' spacing={2} alignItems='center'>
                  {appData.is_fapi_compliant && (
                    <Chip
                      label='FAPI 2.0'
                      size='small'
                      color='primary'
                      variant='filled'
                      sx={{ fontWeight: 900, height: 20, fontSize: '0.65rem' }}
                    />
                  )}
                  <Chip
                    label='ACTIVE'
                    size='small'
                    color='success'
                    sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }}
                  />
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                    ID: {appData.client_id}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            <Button
              variant='contained'
              startIcon={<Save />}
              sx={{ px: 4, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              Save Changes
            </Button>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                minWidth: 120,
              },
            }}
          >
            <Tab label='General Settings' />
            <Tab label='Auth Config' />
            <Tab label='Credentials' />
            <Tab label='Scopes' />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth='lg'>
        {/* Tab 0: General Settings */}
        {tab === 0 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant='h6' sx={{ fontWeight: 800, mb: 3 }}>
                    App Profile
                  </Typography>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label='Application Name'
                      defaultValue={appData.client_name}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label='Description'
                      defaultValue={appData.description}
                    />
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 800, mb: 2 }}>
                        App Logo (URL)
                      </Typography>
                      <TextField fullWidth placeholder='https://...' />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  bgcolor: alpha(theme.palette.info.main, 0.02),
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant='subtitle1'
                    sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Info color='info' /> Metadata
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant='caption' color='text.disabled' sx={{ fontWeight: 800 }}>
                        CREATED
                      </Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        Oct 12, 2023
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.disabled' sx={{ fontWeight: 800 }}>
                        LAST ROTATED
                      </Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        Feb 14, 2024
                      </Typography>
                    </Box>
                    <Divider />
                    <Typography variant='caption' color='text.secondary'>
                      Native and SPA applications should only use PKCE or Client Secret Post for
                      authentication.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Auth Config */}
        {tab === 1 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant='h6' sx={{ fontWeight: 800, mb: 3 }}>
                    OIDC Configuration
                  </Typography>
                  <Stack spacing={4}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Box>
                          <Typography variant='subtitle1' sx={{ fontWeight: 800 }}>
                            FAPI 2.0 Compliance
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            Require PAR, PKCE S256, and DPoP binding.
                          </Typography>
                        </Box>
                        <Switch
                          checked={appData.is_fapi_compliant}
                          onChange={(e) =>
                            updateMutation.mutate({
                              id: appData.id,
                              data: { is_fapi_compliant: e.target.checked },
                            })
                          }
                        />
                      </Stack>
                    </Box>
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 800, mb: 2 }}>
                        Authorized Redirect URIs
                      </Typography>
                      <Stack spacing={1}>
                        {appData.redirect_uris.map((uri, idx) => (
                          <TextField
                            key={idx}
                            fullWidth
                            defaultValue={uri}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton size='small'>
                                    <Refresh fontSize='inherit' />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 800, mb: 2 }}>
                        Grant Types
                      </Typography>
                      <Stack direction='row' spacing={2}>
                        {appData.grant_types.map((gt) => (
                          <Chip
                            key={gt}
                            label={gt}
                            onClick={() => {}}
                            color='primary'
                            sx={{ fontWeight: 700 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tab 2: Credentials */}
        {tab === 2 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant='h6' sx={{ fontWeight: 800, mb: 1 }}>
                    App Credentials
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
                    Your client secret is an authentication key. Keep it confidential.
                  </Typography>

                  <Stack spacing={4}>
                    <Box>
                      <Typography
                        variant='caption'
                        color='text.disabled'
                        sx={{ fontWeight: 800, display: 'block', mb: 1 }}
                      >
                        CLIENT ID
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField fullWidth value={appData.client_id} disabled />
                        <IconButton>
                          <ContentCopy />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        variant='caption'
                        color='text.disabled'
                        sx={{ fontWeight: 800, display: 'block', mb: 1 }}
                      >
                        CLIENT SECRET
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          fullWidth
                          type='password'
                          value={appData.client_secret}
                          disabled
                        />
                        <IconButton>
                          <Refresh />
                        </IconButton>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tab 3: Scopes */}
        {tab === 3 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant='h6' sx={{ fontWeight: 800, mb: 3 }}>
                    Requested Scopes
                  </Typography>
                  <List>
                    {appData.scopes.map((scope: string) => (
                      <ListItem
                        key={scope}
                        sx={{ px: 0, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}
                        secondaryAction={<Switch defaultChecked />}
                      >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                          <Security color='primary' />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography sx={{ fontWeight: 800 }}>{scope}</Typography>}
                          secondary="Grants access to user's identity data."
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  )
}
