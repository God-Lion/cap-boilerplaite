import { Box, Grid, Paper, Typography, Card, CardContent, LinearProgress } from '@mui/material'
import { Shield, Warning, TrendingUp, Security } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { ISecurityScore } from '../../../../domain-kernel/src/types'

interface SecurityDashboardProps {
  score: ISecurityScore | null
  loading?: boolean
  onNavigateToAnomalies?: () => void
  onNavigateToAlerts?: () => void
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ score, loading, onNavigateToAnomalies, onNavigateToAlerts }) => {
  const { t } = useTranslation()

  const getScoreColor = (value: number): string => {
    if (value >= 80) return '#4caf50'
    if (value >= 60) return '#8bc34a'
    if (value >= 40) return '#ffeb3b'
    if (value >= 20) return '#ff9800'
    return '#f44336'
  }

  const getScoreLabel = (value: number): string => {
    if (value >= 80) return t('security.score.excellent')
    if (value >= 60) return t('security.score.good')
    if (value >= 40) return t('security.score.fair')
    if (value >= 20) return t('security.score.poor')
    return t('security.score.critical')
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    )
  }

  if (!score) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">{t('security.noData')}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>{t('security.title')}</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Shield sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h3">{score.overall}</Typography>
              <Typography variant="subtitle1">{getScoreLabel(score.overall)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            {[
              { label: t('security.categories.authentication'), value: score.authentication, icon: <Security /> },
              { label: t('security.categories.authorization'), value: score.authorization, icon: <Security /> },
              { label: t('security.categories.anomalyDetection'), value: score.anomalyDetection, icon: <Warning /> },
              { label: t('security.categories.fraudPrevention'), value: score.fraudPrevention, icon: <TrendingUp /> },
              { label: t('security.categories.threatIntelligence'), value: score.threatIntelligence, icon: <Shield /> },
            ].map((item) => (
              <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">{item.label}</Typography>
                    {item.icon}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': { bgcolor: getScoreColor(item.value) }
                      }}
                    />
                    <Typography variant="body2" fontWeight="bold">{item.value}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {t('security.computedAt')}: {new Date(score.computedAt).toLocaleString()}
      </Typography>
    </Box>
  )
}
