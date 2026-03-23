import { Box, Paper, Typography, Chip, Grid, Divider, List, ListItem, ListItemText, Button, TextField, LinearProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { IAlert, AlertStatus, AlertSeverity, AlertCategory } from '../../../../domain-kernel/src/types'

interface AlertDetailProps {
  alert: IAlert
  onAcknowledge?: () => void
  onResolve?: () => void
  onSuppress?: (durationMinutes: number) => void
  onAddNote?: (note: string) => void
}

const getSeverityColor = (severity: AlertSeverity): string => {
  const colors: Record<AlertSeverity, string> = {
    critical: '#d32f2f',
    high: '#f57c00',
    medium: '#fbc02d',
    low: '#7cb342',
    info: '#9e9e9e',
  }
  return colors[severity]
}

export const AlertDetail: React.FC<AlertDetailProps> = ({ alert, onAcknowledge, onResolve, onSuppress, onAddNote }) => {
  const { t } = useTranslation()

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">{alert.title}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label={t(`alert.severity.${alert.severity}`)} sx={{ bgcolor: getSeverityColor(alert.severity), color: 'white' }} />
          <Chip label={t(`alert.status.${alert.status}`)} color="primary" />
        </Box>
      </Box>

      <Typography variant="body1" sx={{ mb: 3 }}>{alert.description}</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">{t('alert.detail.category')}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{t(`alert.category.${alert.category}`)}</Typography>

          <Typography variant="subtitle2" color="text.secondary">{t('alert.detail.source')}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{alert.source.module} / {alert.source.detector}</Typography>

          <Typography variant="subtitle2" color="text.secondary">{t('alert.detail.rule')}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{alert.ruleId || '-'}</Typography>

          {alert.affectedUserId && (
            <>
              <Typography variant="subtitle2" color="text.secondary">{t('alert.detail.affectedUser')}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{alert.affectedUserId}</Typography>
            </>
          )}

          {alert.affectedIp && (
            <>
              <Typography variant="subtitle2" color="text.secondary">{t('alert.detail.affectedIp')}</Typography>
              <Typography variant="body1">{alert.affectedIp}</Typography>
            </>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">{t('alert.detail.timestamps')}</Typography>
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
            <Typography variant="body2">{t('alert.detail.created')}: {new Date(alert.createdAt).toLocaleString()}</Typography>
            {alert.acknowledgedAt && (
              <Typography variant="body2">{t('alert.detail.acknowledged')}: {new Date(alert.acknowledgedAt).toLocaleString()} ({alert.acknowledgedBy})</Typography>
            )}
            {alert.resolvedAt && (
              <Typography variant="body2">{t('alert.detail.resolved')}: {new Date(alert.resolvedAt).toLocaleString()} ({alert.resolvedBy})</Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {Object.keys(alert.metadata).length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>{t('alert.detail.metadata')}</Typography>
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
            <pre>{JSON.stringify(alert.metadata, null, 2)}</pre>
          </Box>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        {alert.status === 'open' && onAcknowledge && (
          <Button variant="contained" color="warning" onClick={onAcknowledge}>
            {t('alert.actions.acknowledge')}
          </Button>
        )}
        {alert.status !== 'resolved' && onResolve && (
          <Button variant="contained" color="success" onClick={onResolve}>
            {t('alert.actions.resolve')}
          </Button>
        )}
        {alert.status !== 'resolved' && alert.status !== 'suppressed' && onSuppress && (
          <Button variant="outlined" onClick={() => onSuppress(30)}>
            {t('alert.actions.suppress')}
          </Button>
        )}
      </Box>
    </Paper>
  )
}
