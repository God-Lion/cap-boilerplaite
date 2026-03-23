import type { IAnomaly, AnomalyType, AnomalyStatus } from '../types'

// ─── Anomaly Detector Port ───────────────────────────────────────────────────
export interface IAnomalyDetector {
  detect(event: RawSecurityEvent): Promise<DetectionResult>
  getBaseline(userId: string, metric: AnomalyType): Promise<BaselineData | null>
  refreshBaseline(userId: string): Promise<void>
}

export interface IAnomalyRepository {
  findById(id: string): Promise<IAnomaly | null>
  findAll(filters?: AnomalyFilters): Promise<IAnomaly[]>
  create(anomaly: Omit<IAnomaly, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAnomaly>
  updateStatus(id: string, status: AnomalyStatus): Promise<IAnomaly>
  markFalsePositive(id: string): Promise<IAnomaly>
}

export interface RawSecurityEvent {
  userId?: string
  ip?: string
  userAgent?: string
  deviceFingerprint?: string
  eventType: string
  timestamp: string
  metadata: Record<string, unknown>
}

export interface DetectionResult {
  anomalyDetected: boolean
  score: number
  types: AnomalyType[]
  anomalyId?: string
}

export interface BaselineData {
  userId: string
  metric: AnomalyType
  mean: number
  stdDev: number
  samples: number
  computedAt: string
}

export interface AnomalyFilters {
  status?: AnomalyStatus[]
  type?: AnomalyType[]
  affectedUserId?: string
  minScore?: number
  fromDate?: string
  toDate?: string
}
