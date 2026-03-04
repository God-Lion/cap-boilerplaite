import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  alpha,
  useTheme,
  Stack,
  IconButton,
  LinearProgress,
  Paper,
  Divider,
  Alert,
} from '@mui/material'
import {
  Add,
  Sync,
  History,
  CheckCircle,
  Error,
  CloudQueue,
  CloudDone,
  Security,
  Settings,
  ArrowForward,
} from '@mui/icons-material'
import {
  useProvisioningConnectors,
  useSyncProvisioningConnector,
} from '../../../hooks/useAdminQuery'
import { useSnackbar } from 'notistack'

export default function DirectorySyncDashboard() {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const { data: connectorsData, isLoading, refetch } = useProvisioningConnectors()

  const syncMutation = useSyncProvisioningConnector({
    onSuccess: () => {
      enqueueSnackbar('Synchronization started successfully', { variant: 'success' })
      refetch()
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message || 'Failed to start synchronization', { variant: 'error' })
    },
  })

  const connectors = connectorsData?.data ?? []

  const handleSync = (id: number) => {
    syncMutation.mutate(id)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle sx={{ color: 'success.main' }} />
      case 'syncing':
        return <Sync sx={{ color: 'primary.main', animation: 'spin 2s linear infinite' }} />
      case 'failed':
        return <Error sx={{ color: 'error.main' }} />
      default:
        return <CloudQueue sx={{ color: 'text.secondary' }} />
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>

      {/* Header */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>
            Directory Synchronization
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Automate user provisioning and group synchronization from enterprise identity providers.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button
            variant='outlined'
            startIcon={<History />}
            sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Sync Logs
          </Button>
          <Button
            variant='contained'
            startIcon={<Add />}
            sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Add Connector
          </Button>
        </Stack>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Synced Users', value: '1,630', icon: <CheckCircle />, color: 'success' },
          { label: 'Active Connectors', value: '2/3', icon: <CloudDone />, color: 'primary' },
          { label: 'Average Success Rate', value: '94.2%', icon: <Security />, color: 'info' },
        ].map((stat, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(
                    theme.palette[stat.color as 'success' | 'primary' | 'info'].main,
                    0.1,
                  ),
                  color: `${stat.color}.main`,
                  width: 56,
                  height: 56,
                }}
              >
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 700 }}>
                  {stat.label}
                </Typography>
                <Typography variant='h5' sx={{ fontWeight: 900 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Connectors Grid */}
      <Grid container spacing={3}>
        {isLoading ? (
          <Grid size={{ xs: 12 }}>
            <LinearProgress />
          </Grid>
        ) : connectors.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity='info'>
              No directory connectors found. Create one to start syncing.
            </Alert>
          </Grid>
        ) : (
          connectors.map((conn: any) => (
            <Grid key={conn.id} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        <Sync />
                      </Avatar>
                      <Box>
                        <Typography variant='h6' sx={{ fontWeight: 800 }}>
                          {conn.name}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ fontWeight: 700, textTransform: 'uppercase' }}
                        >
                          {conn.type.replace('_', ' ')}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={() => handleSync(conn.id)}>
                      <Sync
                        sx={{
                          animation: syncMutation.isPending ? 'spin 2s linear infinite' : 'none',
                        }}
                      />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography
                        variant='caption'
                        sx={{ fontWeight: 700, color: 'text.secondary' }}
                      >
                        SYNC STATUS
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          fontWeight: 900,
                          color: conn.status === 'active' ? 'success.main' : 'error.main',
                        }}
                      >
                        {conn.status.toUpperCase()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant='determinate'
                      value={conn.status === 'active' ? 100 : 0}
                      color={conn.status === 'active' ? 'success' : 'error'}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.divider, 0.5),
                      }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6 }}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.action.hover, 0.5),
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}
                        >
                          LAST SYNC
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 800 }}>
                          {conn.lastSyncAt ? new Date(conn.lastSyncAt).toLocaleString() : 'Never'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.action.hover, 0.5),
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}
                        >
                          SYNC COUNT
                        </Typography>
                        <Typography variant='h6' sx={{ fontWeight: 800 }}>
                          {conn.syncCount || 0}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(conn.status)}
                      <Typography
                        variant='caption'
                        sx={{ fontWeight: 700, color: 'text.secondary' }}
                      >
                        {conn.errorMessage || 'System Healthy'}
                      </Typography>
                    </Box>
                    <Button
                      size='small'
                      endIcon={<ArrowForward />}
                      sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                      Manage
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}

        {/* Configuration Card */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', color: 'white', width: 64, height: 64 }}>
                <Settings />
              </Avatar>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 800 }}>
                  SCIM 2.0 Inbound Provisioning
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Enable the SCIM API to allow identity providers to push user updates directly to
                  ID-Pro.
                </Typography>
              </Box>
            </Box>
            <Button
              variant='contained'
              color='secondary'
              sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              Configure SCIM
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
