import { apiClient } from '@cap/platform-core'
import type { IAlert, AlertStatus, AlertSeverity, AlertCategory, IAlertRule, CreateAlertPayload } from '../../../../domain-kernel/src/types'

export class AlertService {
  private static baseUrl = '/api/admin/alerts'
  private static rulesUrl = '/api/admin/alert-rules'
  async getAlerts(filters?: {
    severity?: AlertSeverity[]
    status?: AlertStatus[]
    category?: AlertCategory[]
    userId?: string
    ip?: string
    fromDate?: string
    toDate?: string
  }): Promise<{ data: IAlert[]; total: number; page: number; limit: number }> {
    const params: Record<string, string> = {}
    if (filters?.severity?.length) params.severity = filters.severity.join(',')
    if (filters?.status?.length) params.status = filters.status.join(',')
    if (filters?.category?.length) params.category = filters.category.join(',')
    if (filters?.userId) params.userId = filters.userId
    if (filters?.ip) params.ip = filters.ip
    if (filters?.fromDate) params.fromDate = filters.fromDate
    if (filters?.toDate) params.toDate = filters.toDate

    const response = await apiClient.get<any>(AlertService.baseUrl, { params })
    if (!response.data) throw new Error('Failed to fetch alerts')
    return response.data
  }

  async getAlert(id: string): Promise<IAlert | null> {
    const response = await apiClient.get<IAlert>(`${AlertService.baseUrl}/${id}`)
    return response.data ?? null
  }

  async createAlert(payload: CreateAlertPayload): Promise<IAlert> {
    const response = await apiClient.post<IAlert>(AlertService.baseUrl, payload)
    if (!response.data) throw new Error('Failed to create alert')
    return response.data
  }

  async acknowledgeAlert(id: string, userId: string): Promise<IAlert> {
    const response = await apiClient.post<IAlert>(`${AlertService.baseUrl}/${id}/acknowledge`, { userId })
    if (!response.data) throw new Error('Failed to acknowledge alert')
    return response.data
  }

  async resolveAlert(id: string, userId: string): Promise<IAlert> {
    const response = await apiClient.post<IAlert>(`${AlertService.baseUrl}/${id}/resolve`, { userId })
    if (!response.data) throw new Error('Failed to resolve alert')
    return response.data
  }

  async suppressAlert(id: string, durationMinutes: number): Promise<IAlert> {
    const response = await apiClient.post<IAlert>(`${AlertService.baseUrl}/${id}/suppress`, { durationMinutes })
    if (!response.data) throw new Error('Failed to suppress alert')
    return response.data
  }

  async bulkResolve(ids: string[], userId: string): Promise<void> {
    await apiClient.post(`${AlertService.baseUrl}/bulk-resolve`, { ids, userId })
  }

  async getCountBySeverity(): Promise<Record<AlertSeverity, number>> {
    const response = await apiClient.get<Record<AlertSeverity, number>>(`${AlertService.baseUrl}/count-by-severity`)
    if (!response.data) throw new Error('Failed to fetch alert counts')
    return response.data
  }

  async getRules(): Promise<IAlertRule[]> {
    const response = await apiClient.get<IAlertRule[]>(AlertService.rulesUrl)
    if (!response.data) throw new Error('Failed to fetch rules')
    return response.data
  }

  async createRule(rule: Omit<IAlertRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>): Promise<IAlertRule> {
    const response = await apiClient.post<IAlertRule>(AlertService.rulesUrl, rule)
    if (!response.data) throw new Error('Failed to create rule')
    return response.data
  }

  async updateRule(id: string, updates: Partial<IAlertRule>): Promise<IAlertRule> {
    const response = await apiClient.patch<IAlertRule>(`${AlertService.rulesUrl}/${id}`, updates)
    if (!response.data) throw new Error('Failed to update rule')
    return response.data
  }

  async deleteRule(id: string): Promise<void> {
    await apiClient.delete(`${AlertService.rulesUrl}/${id}`)
  }
}

export const alertService = new AlertService()
