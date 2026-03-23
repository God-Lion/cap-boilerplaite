import type { IAlert, AlertSeverity, AlertStatus } from '../types'

// ─── Alert Repository Port ───────────────────────────────────────────────────
export interface IAlertRepository {
  findById(id: string): Promise<IAlert | null>
  findAll(filters?: AlertFilters): Promise<PaginatedAlerts>
  create(payload: CreateAlertPayload): Promise<IAlert>
  acknowledge(id: string, userId: string): Promise<IAlert>
  resolve(id: string, userId: string): Promise<IAlert>
  suppress(id: string, durationMinutes: number): Promise<IAlert>
  bulkResolve(ids: string[], userId: string): Promise<void>
  countBySeverity(): Promise<Record<AlertSeverity, number>>
}

export interface AlertFilters {
  severity?: AlertSeverity[]
  status?: AlertStatus[]
  category?: string[]
  affectedUserId?: string
  affectedIp?: string
  fromDate?: string
  toDate?: string
  page?: number
  limit?: number
}

export interface PaginatedAlerts {
  data: IAlert[]
  total: number
  page: number
  limit: number
}

export interface CreateAlertPayload {
  title: string
  description: string
  severity: AlertSeverity
  category: IAlert['category']
  source: IAlert['source']
  affectedUserId?: string
  affectedIp?: string
  affectedResource?: string
  metadata?: Record<string, unknown>
  ruleId?: string
  anomalyId?: string
  fraudCaseId?: string
}
