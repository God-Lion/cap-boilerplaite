import { Card, CardContent, Typography, Chip, Box, Tooltip } from '@mui/material'
import { Warning, Public, Dns, Email, Hash } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { IThreatIndicator, ThreatCategory, ThreatConfidence } from '../../../../domain-kernel/src/types'
import { getRiskLevelColor } from './utils'

interface ThreatIndicatorCardProps {
  indicator: IThreatIndicator
  onSelect?: () => void
}

const getTypeIcon = (type: IThreatIndicator['type']) => {
  switch (type) {
    case 'ip': return <Dns />
    case 'domain': return <Public />
    case 'email': return <Email />
    case 'hash': return <Hash />
  }
}

const getCategoryLabel = (category: ThreatCategory, t: (key: string) => string): string => {
  const labels: Record<ThreatCategory, string> = {
    malware: t('threat.category.malware'),
    phishing: t('threat.category.phishing'),
    tor_exit: t('threat.category.tor_exit'),
    vpn: t('threat.category.vpn'),
    proxy: t('threat.category.proxy'),
    botnet: t('threat.category.botnet'),
    scanner: t('threat.category.scanner'),
    spam: t('threat.category.spam'),
    cryptominer: t('threat.category.cryptominer'),
    data_center: t('threat.category.data_center'),
  }
  return labels[category] || category
}

const getConfidenceColor = (confidence: ThreatConfidence): 'error' | 'warning' | 'info' => {
  const colors: Record<ThreatConfidence, 'error' | 'warning' | 'info'> = {
    high: 'error',
    medium: 'warning',
    low: 'info',
  }
  return colors[confidence]
}

export const ThreatIndicatorCard: React.FC<ThreatIndicatorCardProps> = ({ indicator, onSelect }) => {
  const { t } = useTranslation()

  return (
    <Card 
      sx={{ 
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onSelect ? { transform: 'translateY(-2px)', boxShadow: 3 } : {}
      }}
      onClick={onSelect}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {getTypeIcon(indicator.type)}
          <Typography variant="h6" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {indicator.value}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          {indicator.categories.map((cat) => (
            <Chip key={cat} label={getCategoryLabel(cat, t)} size="small" variant="outlined" />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={t(`threat.confidence.${indicator.confidence}`)} 
            color={getConfidenceColor(indicator.confidence)} 
            size="small" 
          />
          <Tooltip title={t('threat.riskScore')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning sx={{ color: getRiskLevelColor(indicator.riskScore > 70 ? 'very_high' : indicator.riskScore > 50 ? 'high' : 'medium') }} />
              <Typography variant="body2" fontWeight="bold">
                {indicator.riskScore}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        {indicator.country && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('threat.country')}: {indicator.country} (ASN: {indicator.asn})
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          {t('threat.lastSeen')}: {new Date(indicator.lastSeen).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  )
}
