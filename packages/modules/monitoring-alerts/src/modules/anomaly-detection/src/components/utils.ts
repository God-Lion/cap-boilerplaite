export const getSeverityColor = (score: number): string => {
  if (score >= 80) return '#d32f2f' // critical
  if (score >= 60) return '#f57c00' // high
  if (score >= 40) return '#fbc02d' // medium
  if (score >= 20) return '#7cb342' // low
  return '#4caf50' // minimal
}

export const getSeverityLevel = (score: number): 'critical' | 'high' | 'medium' | 'low' | 'info' => {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  if (score >= 20) return 'low'
  return 'info'
}

export const formatRiskScore = (score: number): string => {
  return `${Math.round(score)}%`
}

export const getRiskLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    very_high: '#d32f2f',
    high: '#f57c00',
    medium: '#fbc02d',
    low: '#7cb342',
  }
  return colors[level] || '#9e9e9e'
}
