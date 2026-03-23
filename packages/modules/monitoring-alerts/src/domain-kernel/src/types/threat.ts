// ─── Threat Feed ─────────────────────────────────────────────────────────────
export type ThreatCategory =
  | 'malware'
  | 'phishing'
  | 'tor_exit'
  | 'vpn'
  | 'proxy'
  | 'botnet'
  | 'scanner'
  | 'spam'
  | 'cryptominer'
  | 'data_center'

export type ThreatConfidence = 'high' | 'medium' | 'low'

export interface IThreatIndicator {
  id: string
  type: 'ip' | 'domain' | 'email' | 'hash'
  value: string
  categories: ThreatCategory[]
  confidence: ThreatConfidence
  riskScore: number     // 0–100
  country?: string
  asn?: string
  lastSeen: string
  firstSeen: string
  reportCount: number
  sources: string[]
}

// ─── Security Metrics ─────────────────────────────────────────────────────────
export interface ISecurityMetric {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  timestamp: string
}

export interface ISecurityScore {
  overall: number        // 0–100
  authentication: number
  authorization: number
  anomalyDetection: number
  fraudPrevention: number
  threatIntelligence: number
  computedAt: string
}

// ─── Event Heatmap ────────────────────────────────────────────────────────────
export interface HeatmapCell {
  hour: number           // 0–23
  day: number            // 0–6 (Mon–Sun)
  count: number
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical'
}
