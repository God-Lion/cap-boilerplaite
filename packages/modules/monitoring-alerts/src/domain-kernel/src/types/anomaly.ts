// ─── Anomaly Score ────────────────────────────────────────────────────────────
export type AnomalyScore = number // 0–100

export type AnomalyStatus = 'detected' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved'

export type AnomalyType =
  | 'login_frequency'
  | 'login_time'
  | 'login_location'
  | 'device_fingerprint'
  | 'request_volume'
  | 'request_pattern'
  | 'permission_usage'
  | 'data_access_volume'
  | 'session_duration'
  | 'failure_rate'

// ─── Anomaly ─────────────────────────────────────────────────────────────────
export interface IAnomaly {
  id: string
  type: AnomalyType
  score: AnomalyScore
  status: AnomalyStatus
  affectedUserId?: string
  affectedIp?: string
  baseline: AnomalyBaseline
  observed: AnomalyObservation
  detectedAt: string
  updatedAt: string
  resolvedAt?: string
  alertIds: string[]
  metadata: Record<string, unknown>
}

export interface AnomalyBaseline {
  metric: string
  expectedValue: number
  expectedRange: [number, number]
  sampleSize: number
  windowDays: number
}

export interface AnomalyObservation {
  metric: string
  observedValue: number
  deviationPercent: number
  observedAt: string
}

// ─── Anomaly Stream Event ─────────────────────────────────────────────────────
export interface AnomalyStreamEvent {
  anomalyId: string
  score: AnomalyScore
  type: AnomalyType
  timestamp: string
}
