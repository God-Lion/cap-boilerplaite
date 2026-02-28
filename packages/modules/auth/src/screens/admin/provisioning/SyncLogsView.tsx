import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  Stack,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import {
  Search,
  FilterList,
  Refresh,
  CheckCircle,
  Error,
  ChevronRight,
  Download,
} from '@mui/icons-material'
import { SyncLog } from '../../../types/provisioning.types'

const mockLogs: SyncLog[] = [
  {
    id: 'l_1',
    connectorId: 'conn_1',
    timestamp: '2024-02-15 14:30:12',
    event: 'user_created',
    target: 'john.doe@enterprise.com',
    status: 'success',
  },
  {
    id: 'l_2',
    connectorId: 'conn_1',
    timestamp: '2024-02-15 14:28:45',
    event: 'user_updated',
    target: 'jane.smith@enterprise.com',
    status: 'success',
  },
  {
    id: 'l_3',
    connectorId: 'conn_2',
    timestamp: '2024-02-15 14:25:00',
    event: 'sync_error',
    target: 'sales_group_sync',
    status: 'failure',
    errorMessage: 'Conflict: Group with same name already exists.',
  },
  {
    id: 'l_4',
    connectorId: 'conn_1',
    timestamp: '2024-02-15 14:20:10',
    event: 'user_deleted',
    target: 'former.emp@enterprise.com',
    status: 'success',
  },
]

export default function SyncLogsView() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')

  const getEventColor = (event: string) => {
    switch (event) {
      case 'user_created':
        return 'success'
      case 'user_updated':
        return 'info'
      case 'user_deleted':
        return 'warning'
      case 'sync_error':
        return 'error'
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
            Sync Telemetry
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Real-time audit log of all provisioning and directory sync events.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button
            variant='outlined'
            startIcon={<Download />}
            sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Export CSV
          </Button>
          <Button
            variant='contained'
            startIcon={<Refresh />}
            sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Refresh Logs
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
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
          placeholder='Search target, event, or error...'
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
        <Button
          startIcon={<FilterList />}
          sx={{ fontWeight: 700, textTransform: 'none', color: 'text.secondary' }}
        >
          Filters
        </Button>
      </Paper>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 900 }}>TIMESTAMP</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>EVENT TYPE</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>TARGET IDENTIFIER</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>STATUS</TableCell>
              <TableCell align='right' sx={{ fontWeight: 900 }}>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockLogs.map((log) => (
              <TableRow
                key={log.id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {log.timestamp}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.event.replace('_', ' ').toUpperCase()}
                    size='small'
                    color={getEventColor(log.event) as any}
                    sx={{
                      fontWeight: 900,
                      borderRadius: 1.5,
                      fontSize: '0.65rem',
                      bgcolor: alpha(
                        theme.palette[
                          getEventColor(log.event) as
                            | 'success'
                            | 'info'
                            | 'warning'
                            | 'error'
                            | 'primary'
                        ].main,
                        0.1,
                      ),
                      color: `${getEventColor(log.event)}.main`,
                    }}
                    variant='filled'
                  />
                </TableCell>
                <TableCell>
                  <Typography variant='body2' sx={{ fontWeight: 700, fontFamily: 'Monospace' }}>
                    {log.target}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {log.status === 'success' ? (
                      <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                    ) : (
                      <Error sx={{ color: 'error.main', fontSize: 18 }} />
                    )}
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 700,
                        color: log.status === 'success' ? 'success.main' : 'error.main',
                      }}
                    >
                      {log.status.toUpperCase()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align='right'>
                  <IconButton size='small'>
                    <ChevronRight />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Troubleshooting Alert */}
      {mockLogs.some((l) => l.status === 'failure') && (
        <Paper
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha(theme.palette.error.main, 0.2),
            bgcolor: alpha(theme.palette.error.main, 0.02),
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Error color='error' />
          <Box sx={{ flex: 1 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
              Action Required: Sync Conflicts Detected
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Some synchronization events failed due to attribute conflicts or permission issues.
              Review the error details to resolve.
            </Typography>
          </Box>
          <Button
            variant='contained'
            color='error'
            size='small'
            sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1.5 }}
          >
            Resolve All
          </Button>
        </Paper>
      )}
    </Box>
  )
}
