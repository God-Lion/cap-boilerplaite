import React, { useState, useCallback, useEffect } from 'react'
import { apiClient } from '@cap/platform-core'
// @ts-ignore
import { Box, Typography, Chip, Avatar, Stack, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, type Theme } from '@mui/material'
// @ts-ignore
import { History, Search, CheckCircle, Cancel, ArrowUpward, ArrowDownward } from '@mui/icons-material'
// @ts-ignore
import { useTranslation } from 'react-i18next'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccessLog {
  id: number
  nfcUid: string
  direction: 'in' | 'out'
  status: 'granted' | 'denied'
  reason: string | null
  scannedAt: string
  user: { id: number; firstName: string; lastName: string; email: string; avatar: string | null } | null
  accessPoint: { id: number; name: string; direction: string } | null
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
  }
}

interface AccessLogsScreenProps {
  orgId: number | string
  apiBase?: string
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

const formatDate = (isoString: string) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
}

// ─── Component ────────────────────────────────────────────────────────────────

const AccessLogsScreen: React.FC<AccessLogsScreenProps> = ({ orgId }) => {
  const { t } = useTranslation()

  const [rows, setRows] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(50)
  const [rowCount, setRowCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'granted' | 'denied'>('all')
  const [directionFilter, setDirectionFilter] = useState<'all' | 'in' | 'out'>('all')

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: Record<string, any> = {}
      if (statusFilter !== 'all') filters.status = statusFilter
      if (directionFilter !== 'all') filters.direction = directionFilter

      const res = await apiClient.get<PaginatedResponse<AccessLog>>(`/api/admin/organizations/${orgId}/nfc/logs`, {
        params: {
          page: page + 1,
          limit: pageSize,
          ...filters
        }
      })
      
      setRows(res.data?.data ?? [])
      setRowCount(res.data?.meta?.total ?? 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [orgId, page, pageSize, statusFilter, directionFilter])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Filter in client-side search for UID/user
  const filteredRows = search
    ? rows.filter(
        (r) =>
          r.nfcUid.toLowerCase().includes(search.toLowerCase()) ||
          r.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
          r.accessPoint?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : rows

  const handleChangePage = (_event: unknown, newPage: number) => {
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
          <Avatar sx={{ bgcolor: 'warning.main', borderRadius: '12px', width: 44, height: 44 }}>
            <History />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {t('nfc.logs.title', 'Access Logs')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('nfc.logs.subtitle', 'Complete audit trail of every NFC scan event.')}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* ── Filters ── */}
      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <TextField
          size="small"
          placeholder={t('nfc.logs.search', 'Search UID, user, or reader...')}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          sx={{ minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>{t('nfc.logs.filter.result', 'Result')}</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value as 'all' | 'granted' | 'denied')}
            label="Result"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="granted">Granted only</MenuItem>
            <MenuItem value="denied">Denied only</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>{t('nfc.logs.filter.direction', 'Direction')}</InputLabel>
          <Select
            value={directionFilter}
            onChange={(e: any) => setDirectionFilter(e.target.value as 'all' | 'in' | 'out')}
            label="Direction"
          >
            <MenuItem value="all">Both</MenuItem>
            <MenuItem value="in">Entries (IN)</MenuItem>
            <MenuItem value="out">Exits (OUT)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* ── Table ── */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.logs.col.time', 'Time')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.logs.col.result', 'Result')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.logs.col.direction', 'Dir')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.logs.col.user', 'User')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.logs.col.reader', 'Reader')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.logs.col.uid', 'Card UID')}</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{t('nfc.logs.col.reason', 'Details')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 8, textAlign: 'center' }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => (
                <TableRow 
                  key={row.id} 
                  hover
                  sx={{ 
                    bgcolor: row.status === 'denied' ? (theme: Theme) => theme.palette.mode === 'dark' ? 'rgba(244,67,54,0.06)' : 'rgba(244,67,54,0.03)' : 'inherit'
                  }}
                >
                  <TableCell>
                    <Tooltip title={row.scannedAt}>
                      <Box>
                        <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                          {formatTime(row.scannedAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(row.scannedAt)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {row.status === 'granted' ? (
                      <Chip
                        size="small"
                        icon={<CheckCircle fontSize="inherit" />}
                        label="GRANTED"
                        color="success"
                        variant="filled"
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    ) : (
                      <Chip
                        size="small"
                        icon={<Cancel fontSize="inherit" />}
                        label="DENIED"
                        color="error"
                        variant="filled"
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.direction === 'in' ? (
                      <Chip
                        size="small"
                        icon={<ArrowDownward fontSize="inherit" />}
                        label="IN"
                        color="info"
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    ) : (
                      <Chip
                        size="small"
                        icon={<ArrowUpward fontSize="inherit" />}
                        label="OUT"
                        color="warning"
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.user ? (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.5 }}>
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
                    ) : (
                      <Typography variant="caption" color="text.disabled" fontStyle="italic">Unknown</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.accessPoint?.name ?? '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      fontSize={11}
                      sx={{ px: 0.75, py: 0.25, bgcolor: 'action.hover', borderRadius: 1, letterSpacing: '0.04em' }}
                    >
                      {row.nfcUid}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={row.reason ? 'error.main' : 'text.disabled'}>
                      {row.reason ?? '—'}
                    </Typography>
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
    </Box>
  )
}

export default AccessLogsScreen
