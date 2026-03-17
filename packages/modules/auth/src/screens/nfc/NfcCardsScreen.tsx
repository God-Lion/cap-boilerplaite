import React, { useState, useCallback, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material'
import {
  Add,
  CreditCard,
  Search,
  Delete,
  Block,
  CheckCircle,
  Refresh,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NfcCard {
  id: number
  nfcUid: string
  label: string | null
  status: 'active' | 'revoked'
  issuedAt: string
  revokedAt: string | null
  user: { id: number; firstName: string; lastName: string; email: string; avatar: string | null }
}

interface NfcCardsScreenProps {
  orgId: number | string
  apiBase?: string
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

const formatDate = (isoString: string) => {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

// ─── Component ────────────────────────────────────────────────────────────────

const NfcCardsScreen: React.FC<NfcCardsScreenProps> = ({ orgId, apiBase = '/api/admin' }) => {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const [rows, setRows] = useState<NfcCard[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [rowCount, setRowCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'revoked'>('all')

  // UI State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [newCard, setNewCard] = useState({ userId: '', nfcUid: '', label: '' })

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(pageSize),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      })
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/cards?${params}`)
      if (!res.ok) throw new Error('Failed to load cards')
      const json = await res.json()
      setRows(json.data ?? [])
      setRowCount(json.meta?.total ?? 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [apiBase, orgId, page, pageSize, statusFilter])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  // Filter in client-side search for UID/user
  const filteredRows = search
    ? rows.filter(
        (r) =>
          r.nfcUid.toLowerCase().includes(search.toLowerCase()) ||
          r.user.email.toLowerCase().includes(search.toLowerCase()) ||
          (r.label && r.label.toLowerCase().includes(search.toLowerCase()))
      )
    : rows

  const handleToggleStatus = async (cardId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'revoked' : 'active'
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/cards/${cardId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      enqueueSnackbar(t('nfc.cards.status_updated', 'Card status updated'), { variant: 'success' })
      fetchCards()
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Action failed', { variant: 'error' })
    }
  }

  const handleDelete = async (cardId: number) => {
    if (!window.confirm(t('nfc.cards.confirm_delete', 'Are you sure you want to delete this card?'))) return
    try {
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/cards/${cardId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      enqueueSnackbar(t('nfc.cards.deleted', 'Card deleted'), { variant: 'success' })
      fetchCards()
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Delete failed', { variant: 'error' })
    }
  }

  const handleRegister = async () => {
    if (!newCard.userId || !newCard.nfcUid) return
    try {
      setRegistering(true)
      const res = await fetch(`${apiBase}/organizations/${orgId}/nfc/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Registration failed')
      }
      enqueueSnackbar(t('nfc.cards.registered', 'Card registered successfully'), { variant: 'success' })
      setIsRegisterOpen(false)
      setNewCard({ userId: '', nfcUid: '', label: '' })
      fetchCards()
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Register failed', { variant: 'error' })
    } finally {
      setRegistering(false)
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box>
      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', borderRadius: '12px', width: 44, height: 44 }}>
            <CreditCard />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {t('nfc.cards.title', 'NFC Cards')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('nfc.cards.subtitle', 'Manage physical access cards for organization members.')}
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsRegisterOpen(true)}>
          {t('nfc.cards.btn_register', 'Register Card')}
        </Button>
      </Stack>

      {/* ── Filters ── */}
      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <TextField
          size="small"
          placeholder={t('nfc.cards.search', 'Search UID, label or email...')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{t('nfc.cards.filter_status', 'Status')}</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'revoked')}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="revoked">Revoked</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={fetchCards} disabled={loading} size="small">
          <Refresh fontSize="small" />
        </IconButton>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* ── Table ── */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.cards.col.user', 'User')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.cards.col.uid', 'UID')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.cards.col.status', 'Status')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.cards.col.issued', 'Issued')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('common.actions', 'Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 8, textAlign: 'center' }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                  No cards found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={row.user.avatar ?? undefined} sx={{ width: 24, height: 24, borderRadius: '4px', fontSize: '0.7rem' }}>
                        {row.user.firstName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                          {row.user.firstName} {row.user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.user.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" fontSize={12}>{row.nfcUid}</Typography>
                    {row.label && <Typography variant="caption" display="block" color="text.secondary">{row.label}</Typography>}
                  </TableCell>
                  <TableCell>
                    {row.status === 'active' ? (
                      <Chip label="ACTIVE" color="success" size="small" variant="filled" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                    ) : (
                      <Chip label="REVOKED" color="error" size="small" variant="filled" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(row.issuedAt)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={row.status === 'active' ? 'Revoke' : 'Activate'}>
                      <IconButton size="small" onClick={() => handleToggleStatus(row.id, row.status)}>
                        {row.status === 'active' ? <Block color="error" fontSize="small" /> : <CheckCircle color="success" fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={rowCount}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* ── Dialog: Register Card ── */}
      <Dialog open={isRegisterOpen} onClose={() => !registering && setIsRegisterOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={800}>{t('nfc.cards.register_title', 'Register New Card')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label={t('nfc.cards.field_user_id', 'User ID')}
              placeholder="e.g. 12"
              fullWidth
              value={newCard.userId}
              onChange={(e) => setNewCard({ ...newCard, userId: e.target.value })}
            />
            <TextField
              label={t('nfc.cards.field_uid', 'NFC Hardware UID')}
              placeholder="e.g. 04:A3:B2:1C"
              fullWidth
              value={newCard.nfcUid}
              onChange={(e) => setNewCard({ ...newCard, nfcUid: e.target.value })}
              helperText="The unique hex hardware ID of the card."
            />
            <TextField
              label={t('nfc.cards.field_label', 'Label (Optional)')}
              placeholder="e.g. Master Key"
              fullWidth
              value={newCard.label}
              onChange={(e) => setNewCard({ ...newCard, label: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setIsRegisterOpen(false)} disabled={registering}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleRegister}
            loading={registering}
            disabled={!newCard.userId || !newCard.nfcUid}
          >
            {t('nfc.cards.btn_register_submit', 'Confirm Registration')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default NfcCardsScreen
