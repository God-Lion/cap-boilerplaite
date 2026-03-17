import React, { useState, useCallback, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
} from '@mui/material'
import {
  Add,
  Sensors,
  Delete,
  Settings,
  VpnKey,
  Wifi,
  WifiOff,
  ContentCopy,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccessPoint {
  id: number
  name: string
  direction: 'in' | 'out' | 'both'
  tokenPrefix: string
  status: 'active' | 'inactive'
  lastSeenAt: string | null
}

interface AccessPointsScreenProps {
  orgId: number | string
  apiBase?: string
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

const formatTimeAgo = (isoString: string | null) => {
  if (!isoString) return 'Never seen'
  const date = new Date(isoString)
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ─── Component ────────────────────────────────────────────────────────────────

const AccessPointsScreen: React.FC<AccessPointsScreenProps> = ({ orgId, apiBase = '/api/admin' }) => {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const [points, setPoints] = useState<AccessPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Token Reveal Dialog
  const [revealDialog, setRevealDialog] = useState<{ open: boolean; token: string; name: string }>({
    open: false,
    token: '',
    name: '',
  })

  // Create/Edit Dialog
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', direction: 'both' })

  const fetchPoints = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/access-points`)
      if (!res.ok) throw new Error('Failed to load access points')
      const json = await res.json()
      setPoints(json ?? [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [apiBase, orgId])

  useEffect(() => {
    fetchPoints()
  }, [fetchPoints])

  const handleCreate = async () => {
    try {
      setFormLoading(true)
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/access-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to create')
      const json = await res.json()
      setRevealDialog({ open: true, token: json.token, name: json.accessPoint.name })
      setIsFormOpen(false)
      setFormData({ name: '', direction: 'both' })
      fetchPoints()
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Creation failed', { variant: 'error' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleRegenerateToken = async (pointId: number, name: string) => {
    if (!window.confirm(t('nfc.points.confirm_regenerate', 'Regenerate token? The old one will immediately stop working.'))) return
    try {
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/access-points/${pointId}/regenerate-token`, { method: 'POST' })
      if (!res.ok) throw new Error('Regeneration failed')
      const json = await res.json()
      setRevealDialog({ open: true, token: json.token, name })
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Action failed', { variant: 'error' })
    }
  }

  const handleToggleStatus = async (point: AccessPoint) => {
    try {
      const newStatus = point.status === 'active' ? 'inactive' : 'active'
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/access-points/${point.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      enqueueSnackbar(t('nfc.points.status_updated', 'Reader updated'), { variant: 'success' })
      fetchPoints()
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Update failed', { variant: 'error' })
    }
  }

  const handleDelete = async (pointId: number) => {
    if (!window.confirm(t('nfc.points.confirm_delete', 'Are you sure you want to delete this reader?'))) return
    try {
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/access-points/${pointId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      enqueueSnackbar(t('nfc.points.deleted', 'Reader deleted'), { variant: 'success' })
      fetchPoints()
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Delete failed', { variant: 'error' })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    enqueueSnackbar(t('common.copied', 'Copied to clipboard'), { variant: 'info', autoHideDuration: 2000 })
  }

  return (
    <Box>
      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: '12px', width: 44, height: 44 }}>
            <Sensors />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {t('nfc.points.title', 'Access Points')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('nfc.points.subtitle', 'Configure and monitor your physical NFC reader hardware.')}
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsFormOpen(true)}>
          {t('nfc.points.btn_add', 'Add Reader')}
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* ── Grid ── */}
      {loading && points.length === 0 ? (
        <Box textAlign="center" py={8}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {points.map((point) => (
            <Grid key={point.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, transition: '0.2s', '&:hover': { boxShadow: 4, borderColor: 'primary.main' } }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} lineHeight={1}>
                        {point.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        {point.lastSeenAt ? <Wifi color="success" sx={{ fontSize: 12, mr: 0.5 }} /> : <WifiOff color="disabled" sx={{ fontSize: 12, mr: 0.5 }} />}
                        {formatTimeAgo(point.lastSeenAt)}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={point.direction.toUpperCase()}
                      color={point.direction === 'in' ? 'info' : point.direction === 'out' ? 'warning' : 'primary'}
                      sx={{ fontWeight: 800, fontSize: '0.6rem' }}
                    />
                  </Stack>

                  <Box bgcolor="action.hover" p={1.5} borderRadius={2} mb={2}>
                    <Typography variant="caption" color="text.secondary" display="block">API Token Prefix</Typography>
                    <Typography variant="body2" fontFamily="monospace" fontWeight={700}>{point.tokenPrefix}••••••••</Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Chip
                      size="small"
                      label={point.status === 'active' ? 'ENABLED' : 'DISABLED'}
                      color={point.status === 'active' ? 'success' : 'default'}
                      onClick={() => handleToggleStatus(point)}
                    />
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Regenerate Token">
                      <IconButton size="small" onClick={() => handleRegenerateToken(point.id, point.name)}><VpnKey fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton size="small"><Settings fontSize="small" /></IconButton>
                    </Tooltip>
                  </Stack>
                  <IconButton color="error" size="small" onClick={() => handleDelete(point.id)}><Delete fontSize="small" /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Form Dialog ── */}
      <Dialog open={isFormOpen} onClose={() => !formLoading && setIsFormOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={800}>{t('nfc.points.add_title', 'Configure New Reader')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Reader Name"
              placeholder="e.g. Front Gate"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Direction</InputLabel>
              <Select
                value={formData.direction}
                label="Direction"
                onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
              >
                <MenuItem value="in">Entrance (IN)</MenuItem>
                <MenuItem value="out">Exit (OUT)</MenuItem>
                <MenuItem value="both">Bi-directional (Both)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsFormOpen(false)} disabled={formLoading}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} loading={formLoading} disabled={!formData.name}>Create Reader</Button>
        </DialogActions>
      </Dialog>

      {/* ── Token Reveal Dialog ── */}
      <Dialog open={revealDialog.open} onClose={() => setRevealDialog({ ...revealDialog, open: false })} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={800} sx={{ color: 'warning.main' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <VpnKey color="warning" />
            <Box>Secure API Token</Box>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This token will <strong>never</strong> be shown again. Copy it now and store it in your hardware's config.
          </Alert>
          <Typography variant="caption" color="text.secondary">Reader Name:</Typography>
          <Typography variant="body1" fontWeight={700} gutterBottom>{revealDialog.name}</Typography>
          
          <Box
            sx={{
              p: 2,
              bgcolor: 'black',
              color: 'primary.light',
              borderRadius: 2,
              fontFamily: 'monospace',
              position: 'relative',
              mt: 2,
              wordBreak: 'break-all'
            }}
          >
            {revealDialog.token}
            <IconButton
              size="small"
              sx={{ position: 'absolute', top: 4, right: 4, color: 'primary.light' }}
              onClick={() => copyToClipboard(revealDialog.token)}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" fullWidth onClick={() => setRevealDialog({ ...revealDialog, open: false })}>I have saved this token</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AccessPointsScreen
