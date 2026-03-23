import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography, IconButton, Tooltip, Menu, MenuItem } from '@mui/material'
import { Visibility, CheckCircle, SupervisorAccount, MoreVert } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { IAlert, AlertStatus, AlertSeverity, AlertCategory } from '../../../../domain-kernel/src/types'

interface AlertListProps {
  alerts: IAlert[]
  onAcknowledge?: (id: string) => void
  onResolve?: (id: string) => void
  onSuppress?: (id: string) => void
}

const getSeverityColor = (severity: AlertSeverity): 'error' | 'warning' | 'info' | 'default' | 'success' => {
  const colors: Record<AlertSeverity, 'error' | 'warning' | 'info' | 'default' | 'success'> = {
    critical: 'error',
    high: 'error',
    medium: 'warning',
    low: 'info',
    info: 'default',
  }
  return colors[severity]
}

const getStatusColor = (status: AlertStatus): 'default' | 'info' | 'warning' | 'success' => {
  const colors: Record<AlertStatus, 'default' | 'info' | 'warning' | 'success'> = {
    open: 'error',
    acknowledged: 'warning',
    resolved: 'success',
    suppressed: 'default',
    expired: 'default',
  }
  return colors[status]
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, onAcknowledge, onResolve, onSuppress }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, alertId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedAlert(alertId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedAlert(null)
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('alert.table.severity')}</TableCell>
              <TableCell>{t('alert.table.title')}</TableCell>
              <TableCell>{t('alert.table.category')}</TableCell>
              <TableCell>{t('alert.table.status')}</TableCell>
              <TableCell>{t('alert.table.source')}</TableCell>
              <TableCell>{t('alert.table.createdAt')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">{t('alert.noData')}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert.id} hover>
                  <TableCell>
                    <Chip label={t(`alert.severity.${alert.severity}`)} color={getSeverityColor(alert.severity)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {alert.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={t(`alert.category.${alert.category}`)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={t(`alert.status.${alert.status}`)} color={getStatusColor(alert.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {alert.source.module}/{alert.source.detector}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(alert.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.view')}>
                      <IconButton size="small" onClick={() => navigate(`/monitoring/alerts/${alert.id}`)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {alert.status === 'open' && onAcknowledge && (
                      <Tooltip title={t('alert.actions.acknowledge')}>
                        <IconButton size="small" color="warning" onClick={() => onAcknowledge(alert.id)}>
                          <SupervisorAccount fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {alert.status !== 'resolved' && onResolve && (
                      <Tooltip title={t('alert.actions.resolve')}>
                        <IconButton size="small" color="success" onClick={() => onResolve(alert.id)}>
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, alert.id)}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { navigate(`/monitoring/alerts/${selectedAlert}`); handleMenuClose() }}>
          {t('common.view')}
        </MenuItem>
        {onAcknowledge && selectedAlert && (
          <MenuItem onClick={() => { onAcknowledge(selectedAlert); handleMenuClose() }}>
            {t('alert.actions.acknowledge')}
          </MenuItem>
        )}
        {onResolve && selectedAlert && (
          <MenuItem onClick={() => { onResolve(selectedAlert); handleMenuClose() }}>
            {t('alert.actions.resolve')}
          </MenuItem>
        )}
        {onSuppress && selectedAlert && (
          <MenuItem onClick={() => { onSuppress(selectedAlert); handleMenuClose() }}>
            {t('alert.actions.suppress')}
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}
