import { Box, Paper, Typography, Chip, Grid, Divider, List, ListItem, ListItemText, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { IAnomaly, AnomalyType } from '../../../../domain-kernel/src/types'
import { getSeverityColor, formatRiskScore } from './utils'

interface AnomalyDetailProps {
  anomaly: IAnomaly
  onStatusChange?: (status: IAnomaly['status']) => void
  onMarkFalsePositive?: () => void
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

export const AnomalyDetail: React.FC<AnomalyDetailProps> = ({ anomaly, onStatusChange, onMarkFalsePositive }) => {
  const { t } = useTranslation()

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">{t('anomaly.detail.title')}</Typography>
        <Chip
          label={`${t('anomaly.score')}: ${formatRiskScore(anomaly.score)}`}
          sx={{ bgcolor: getSeverityColor(anomaly.score), color: 'white', fontWeight: 'bold' }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">{t('anomaly.detail.type')}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{getTypeLabel(anomaly.type, t)}</Typography>

          <Typography variant="subtitle2" color="text.secondary">{t('anomaly.detail.status')}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{t(`anomaly.status.${anomaly.status}`)}</Typography>

          <Typography variant="subtitle2" color="text.secondary">{t('anomaly.detail.user')}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{anomaly.affectedUserId || '-'}</Typography>

          <Typography variant="subtitle2" color="text.secondary">{t('anomaly.detail.ip')}</Typography>
          <Typography variant="body1">{anomaly.affectedIp || '-'}</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">{t('anomaly.detail.baseline')}</Typography>
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2">
              {t('anomaly.detail.expected')}: {anomaly.baseline.expectedValue} ({anomaly.baseline.expectedRange[0]} - {anomaly.baseline.expectedRange[1]})
            </Typography>
            <Typography variant="body2">
              {t('anomaly.detail.sampleSize')}: {anomaly.baseline.sampleSize}
            </Typography>
          </Box>

          <Typography variant="subtitle2" color="text.secondary">{t('anomaly.detail.observed')}</Typography>
          <Box sx={{ bgcolor: 'error.light', p: 2, borderRadius: 1 }}>
            <Typography variant="body2">
              {t('anomaly.detail.observedValue')}: {anomaly.observed.observedValue}
            </Typography>
            <Typography variant="body2">
              {t('anomaly.detail.deviation')}: {anomaly.observed.deviationPercent}%
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>{t('anomaly.detail.timeline')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('anomaly.detail.detectedAt')}: {new Date(anomaly.detectedAt).toLocaleString()}
      </Typography>
      {anomaly.resolvedAt && (
        <Typography variant="body2" color="text.secondary">
          {t('anomaly.detail.resolvedAt')}: {new Date(anomaly.resolvedAt).toLocaleString()}
        </Typography>
      )}

      {anomaly.alertIds.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>{t('anomaly.detail.linkedAlerts')}</Typography>
          <List dense>
            {anomaly.alertIds.map((alertId) => (
              <ListItem key={alertId}>
                <ListItemText primary={alertId} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        {anomaly.status === 'detected' && onStatusChange && (
          <Button variant="contained" color="primary" onClick={() => onStatusChange('investigating')}>
            {t('anomaly.actions.investigate')}
          </Button>
        )}
        {anomaly.status === 'investigating' && onStatusChange && (
          <Button variant="contained" color="success" onClick={() => onStatusChange('confirmed')}>
            {t('anomaly.actions.confirm')}
          </Button>
        )}
        {(anomaly.status === 'detected' || anomaly.status === 'investigating') && onMarkFalsePositive && (
          <Button variant="outlined" onClick={onMarkFalsePositive}>
            {t('anomaly.actions.falsePositive')}
          </Button>
        )}
      </Box>
    </Paper>
  )
}
