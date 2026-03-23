import { apiClient } from '@cap/platform-core'
import type { IAnomaly, AnomalyType, AnomalyStatus, ISecurityScore } from '../../../../domain-kernel/src/types'
import type { RawSecurityEvent, DetectionResult, BaselineData } from '../../../../domain-kernel/src/ports/IAnomalyDetector'

export class AnomalyService {
  private static baseUrl = '/api/admin/anomalies'

  async detect(event: RawSecurityEvent): Promise<DetectionResult> {
    const response = await apiClient.post<DetectionResult>(`${AnomalyService.baseUrl}/detect`, event)
    if (!response.data) throw new Error('Anomaly detection failed')
    return response.data
  }

  async getAnomaly(id: string): Promise<IAnomaly | null> {
    const response = await apiClient.get<IAnomaly>(`${AnomalyService.baseUrl}/${id}`)
    return response.data ?? null
  }

  async getAnomalies(filters?: {
    status?: AnomalyStatus[]
    type?: AnomalyType[]
    userId?: string
    minScore?: number
    fromDate?: string
    toDate?: string
  }): Promise<IAnomaly[]> {
    const params: Record<string, string> = {}
    if (filters?.status?.length) params.status = filters.status.join(',')
    if (filters?.type?.length) params.type = filters.type.join(',')
    if (filters?.userId) params.userId = filters.userId
    if (filters?.minScore) params.minScore = String(filters.minScore)
    if (filters?.fromDate) params.fromDate = filters.fromDate
    if (filters?.toDate) params.toDate = filters.toDate

    const response = await apiClient.get<IAnomaly[]>(AnomalyService.baseUrl, { params })
    return response.data ?? []
  }

  async getAnomalyStats(): Promise<any> {
    const response = await apiClient.get<any>(`${AnomalyService.baseUrl}/stats`)
    if (!response.data) throw new Error('Failed to fetch anomaly stats')
    return response.data
  }

  async updateStatus(id: string, status: AnomalyStatus): Promise<IAnomaly> {
    const response = await apiClient.patch<IAnomaly>(`${AnomalyService.baseUrl}/${id}/status`, { status })
    if (!response.data) throw new Error('Failed to update anomaly status')
    return response.data
  }

  async markFalsePositive(id: string): Promise<IAnomaly> {
    const response = await apiClient.post<IAnomaly>(`${AnomalyService.baseUrl}/${id}/false-positive`)
    if (!response.data) throw new Error('Failed to mark as false positive')
    return response.data
  }

  async getSecurityScore(): Promise<ISecurityScore> {
    const response = await apiClient.get<ISecurityScore>(`${AnomalyService.baseUrl}/score`)
    if (!response.data) throw new Error('Failed to fetch security score')
    return response.data
  }

  async getBaseline(userId: string, metric: AnomalyType): Promise<BaselineData | null> {
    const response = await apiClient.get<BaselineData>(`/api/admin/baseline/${userId}/${metric}`)
    return response.data ?? null
  }

  async refreshBaseline(userId: string): Promise<void> {
    await apiClient.post(`/api/admin/baseline/${userId}/refresh`)
  }
}

export const anomalyService = new AnomalyService()
