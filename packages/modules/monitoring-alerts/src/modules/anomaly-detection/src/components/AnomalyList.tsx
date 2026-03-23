import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography, IconButton, Tooltip } from '@mui/material'
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { IAnomaly, AnomalyStatus, AnomalyType } from '../../../../domain-kernel/src/types'
import { getSeverityColor } from './utils'

interface AnomalyListProps {
  anomalies: IAnomaly[]
  onStatusChange?: (id: string, status: AnomalyStatus) => void
}

const getStatusColor = (status: AnomalyStatus): 'default' | 'info' | 'warning' | 'success' | 'error' => {
  const mapping: Record<AnomalyStatus, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
    detected: 'error',
    investigating: 'warning',
    confirmed: 'error',
    false_positive: 'default',
    resolved: 'success',
  }
  return mapping[status]
}

const getTypeLabel = (type: AnomalyType, t: (key: string) => string): string => {
  const labels: Record<AnomalyType, string> = {
    login_frequency: t('anomaly.types.login_frequency'),
    login_time: t('anomaly.types.login_time'),
    login_location: t('anomaly.types.login_location'),
    device_fingerprint: t('anomaly.types.device_fingerprint'),
    request_volume: t('anomaly.types.request_volume'),
    request_pattern: t('anomaly.types.request_pattern'),
    permission_usage: t('anomaly.types.permission_usage'),
    data_access_volume: t('anomaly.types.data_access_volume'),
    session_duration: t('anomaly.types.session_duration'),
    failure_rate: t('anomaly.types.failure_rate'),
  }
  return labels[type] || type
}

export const AnomalyList: React.FC<AnomalyListProps> = ({ anomalies, onStatusChange }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('anomaly.table.type')}</TableCell>
            <TableCell>{t('anomaly.table.score')}</TableCell>
            <TableCell>{t('anomaly.table.status')}</TableCell>
            <TableCell>{t('anomaly.table.user')}</TableCell>
            <TableCell>{t('anomaly.table.ip')}</TableCell>
            <TableCell>{t('anomaly.table.detectedAt')}</TableCell>
            <TableCell align="right">{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {anomalies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography color="text.secondary">{t('anomaly.noData')}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            anomalies.map((anomaly) => (
              <TableRow key={anomaly.id} hover>
                <TableCell>
                  <Chip label={getTypeLabel(anomaly.type, t)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${anomaly.score}%`}
                    size="small"
                    sx={{ bgcolor: getSeverityColor(anomaly.score), color: 'white' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip label={t(`anomaly.status.${anomaly.status}`)} color={getStatusColor(anomaly.status)} size="small" />
                </TableCell>
                <TableCell>{anomaly.affectedUserId || '-'}</TableCell>
                <TableCell>{anomaly.affectedIp || '-'}</TableCell>
                <TableCell>{new Date(anomaly.detectedAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Tooltip title={t('common.view')}>
                    <IconButton size="small" onClick={() => navigate(`/monitoring/anomalies/${anomaly.id}`)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {anomaly.status === 'detected' && onStatusChange && (
                    <>
                      <Tooltip title={t('anomaly.markResolved')}>
                        <IconButton size="small" color="success" onClick={() => onStatusChange(anomaly.id, 'resolved')}>
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('anomaly.markFalsePositive')}>
                        <IconButton size="small" onClick={() => onStatusChange(anomaly.id, 'false_positive')}>
                          <Cancel fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
