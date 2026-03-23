// ─── Fraud Case ───────────────────────────────────────────────────────────────
export type FraudCaseStatus = 'open' | 'under_review' | 'confirmed' | 'cleared' | 'escalated'

export type FraudType =
  | 'account_takeover'
  | 'identity_theft'
  | 'credential_stuffing'
  | 'synthetic_identity'
  | 'payment_fraud'
  | 'promo_abuse'
  | 'bot_registration'
  | 'impossible_travel'
  | 'sim_swapping'
  | 'social_engineering'

export type FraudRiskLevel = 'very_high' | 'high' | 'medium' | 'low'

// ─── Fraud Signal ─────────────────────────────────────────────────────────────
export interface FraudSignal {
  name: string
  weight: number        // 0–1
  triggered: boolean
  value?: string | number
  description: string
}

// ─── Fraud Case ───────────────────────────────────────────────────────────────
export interface IFraudCase {
  id: string
  type: FraudType
  riskLevel: FraudRiskLevel
  riskScore: number     // 0–100
  status: FraudCaseStatus
  affectedUserId: string
  affectedIp?: string
  affectedDevice?: string
  signals: FraudSignal[]
  timeline: FraudTimelineEntry[]
  alertIds: string[]
  assignedTo?: string
  notes?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface FraudTimelineEntry {
  id: string
  action: string
  performedBy: 'system' | 'analyst'
  performedById?: string
  timestamp: string
  details?: string
}

// ─── Fraud Stats ──────────────────────────────────────────────────────────────
export interface FraudStats {
  totalCases: number
  openCases: number
  confirmedCases: number
  clearedCases: number
  avgRiskScore: number
  topFraudTypes: Array<{ type: FraudType; count: number }>
}
