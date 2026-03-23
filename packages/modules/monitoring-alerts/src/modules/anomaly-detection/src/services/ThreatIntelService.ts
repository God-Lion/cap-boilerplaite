import { apiClient } from '@cap/platform-core'
import type { IThreatIndicator, ISecurityMetric, ISecurityScore, ThreatCategory } from '../../../../domain-kernel/src/types'

export class ThreatIntelService {
  private static baseUrl = '/api/admin/threat-intel'

  async checkIp(ip: string): Promise<IThreatIndicator | null> {
    const response = await apiClient.get<IThreatIndicator>(`${ThreatIntelService.baseUrl}/ip/${ip}`)
    return response.data ?? null
  }

  async checkDomain(domain: string): Promise<IThreatIndicator | null> {
    const response = await apiClient.get<IThreatIndicator>(`${ThreatIntelService.baseUrl}/domain/${domain}`)
    return response.data ?? null
  }

  async getThreatIndicators(filters?: {
    category?: ThreatCategory[]
    confidence?: string
    minRiskScore?: number
    fromDate?: string
    toDate?: string
  }): Promise<IThreatIndicator[]> {
    const params: Record<string, string> = {}
    if (filters?.category?.length) params.category = filters.category.join(',')
    if (filters?.confidence) params.confidence = filters.confidence
    if (filters?.minRiskScore) params.minRiskScore = String(filters.minRiskScore)
    if (filters?.fromDate) params.fromDate = filters.fromDate
    if (filters?.toDate) params.toDate = filters.toDate

    const response = await apiClient.get<IThreatIndicator[]>(`${ThreatIntelService.baseUrl}/indicators`, { params })
    return response.data ?? []
  }

  async getSecurityMetrics(): Promise<ISecurityMetric[]> {
    const response = await apiClient.get<ISecurityMetric[]>(`${ThreatIntelService.baseUrl}/metrics`)
    if (!response.data) throw new Error('Failed to fetch security metrics')
    return response.data
  }

  async getSecurityScore(): Promise<ISecurityScore> {
    const response = await apiClient.get<ISecurityScore>(`${ThreatIntelService.baseUrl}/score`)
    if (!response.data) throw new Error('Failed to fetch security score')
    return response.data
  }

  async getHeatmapData(): Promise<Array<{ hour: number; day: number; count: number; severity: string }>> {
    const response = await apiClient.get<any[]>(`${ThreatIntelService.baseUrl}/heatmap`)
    if (!response.data) throw new Error('Failed to fetch heatmap data')
    return response.data
  }
}

export const threatIntelService = new ThreatIntelService()
