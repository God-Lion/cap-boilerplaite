import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  alpha,
  useTheme,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Paper,
  Divider,
} from '@mui/material'
import {
  Search,
  Add,
  MoreVert,
  AppRegistration,
  VpnKey,
  Launch,
  History,
  Code,
  Web,
  Smartphone,
  Router,
  Security,
  Edit,
  Delete,
  Refresh,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useOIDCClients } from '../../../hooks/useAdminQuery'
import Path from '../path'

export default function ApplicationDashboard() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { data: clientsResponse, isLoading } = useOIDCClients()
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  if (isLoading) return <Box>Loading...</Box>
  const clients = clientsResponse?.data || []

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, _appId: string | number) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spa':
        return <Web />
      case 'native':
        return <Smartphone />
      case 'service':
        return <Router />
      case 'web':
        return <Code />
      case 'saml':
        return <Security />
      default:
        return <AppRegistration />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'suspended':
        return 'error'
      case 'development':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>
            Application Registry
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Manage OAuth2/OIDC clients, SAML providers, and secure credentials.
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Add />}
          sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
        >
          New Application
        </Button>
      </Box>

      {/* Search & Filter */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          display: 'flex',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder='Search applications by name or client ID...'
          size='small'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
        <Stack direction='row' spacing={1} sx={{ ml: 'auto' }}>
          <Button
            startIcon={<History />}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Logs
          </Button>
          <Button
            startIcon={<Refresh />}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Refresh
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {clients.map((app) => (
          <Grid key={app.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.01),
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      borderRadius: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {getTypeIcon(app.type)}
                  </Avatar>
                  <Box>
                    <IconButton size='small' onClick={(e) => handleOpenMenu(e, app.id)}>
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant='h6' sx={{ fontWeight: 800, mb: 0.5 }}>
                  {app.client_name}
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, fontWeight: 700 }}
                >
                  <Code sx={{ fontSize: 14 }} /> {app.client_id}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 3, lineClamp: 2, minHeight: 40 }}
                >
                  {app.description}
                </Typography>

                <Stack direction='row' spacing={1} sx={{ mb: 3 }}>
                  {app.is_fapi_compliant && (
                    <Chip
                      label='FAPI 2.0'
                      size='small'
                      color='primary'
                      sx={{ fontWeight: 900, borderRadius: 1.5, height: 20, fontSize: '0.65rem' }}
                    />
                  )}
                  <Chip
                    label={app.status}
                    size='small'
                    color={getStatusColor(app.status) as any}
                    sx={{
                      fontWeight: 900,
                      borderRadius: 1.5,
                      height: 20,
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                    }}
                  />
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography
                      variant='caption'
                      color='text.disabled'
                      sx={{ fontWeight: 700, display: 'block' }}
                    >
                      SECRET
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 600,
                        color: app.client_secret ? 'text.primary' : 'text.disabled',
                      }}
                    >
                      {app.client_secret ? '•••• •••• ab2c' : 'PKCE Protected'}
                    </Typography>
                  </Box>
                  <Button
                    size='small'
                    variant='contained'
                    color='primary'
                    startIcon={<Launch />}
                    onClick={() => navigate(Path.appDetail.replace(':id', String(app.id)))}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                      boxShadow: 'none',
                    }}
                  >
                    Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Create Card */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box
            sx={{
              height: '100%',
              minHeight: 250,
              borderRadius: 4,
              border: '2px dashed',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: 0.7,
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                opacity: 1,
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.action.hover, 0.8),
                color: 'text.secondary',
                mb: 2,
              }}
            >
              <Add />
            </Avatar>
            <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
              Register Application
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              OIDC, SAML, or S2S
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* App Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0px 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            Edit Settings
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <VpnKey fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            Rotate Secret
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize='small' color='error' />
          </ListItemIcon>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            De-register
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}
