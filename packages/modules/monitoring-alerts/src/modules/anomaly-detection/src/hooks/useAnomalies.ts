import { useQuery } from '@tanstack/react-query'
import type { IAnomaly, AnomalyStatus, AnomalyType } from '../../../../domain-kernel/src/types'
import { anomalyService } from '../services/AnomalyService'

export interface AnomalyFilters {
  status?: AnomalyStatus[]
  type?: AnomalyType[]
  affectedUserId?: string
  minScore?: number
  fromDate?: string
  toDate?: string
}

export interface UseAnomaliesOptions {
  filters?: AnomalyFilters
  enabled?: boolean
}

export const useAnomalies = ({ filters, enabled = true }: UseAnomaliesOptions = {}) => {
  return useQuery({
    queryKey: ['anomalies', filters],
    queryFn: () => anomalyService.getAnomalies({
      status: filters?.status,
      type: filters?.type,
      userId: filters?.affectedUserId,
      minScore: filters?.minScore,
      fromDate: filters?.fromDate,
      toDate: filters?.toDate,
    }),
    enabled,
  })
}

export const useAnomaly = (id: string, enabled = !!id) => {
  return useQuery({
    queryKey: ['anomaly', id],
    queryFn: () => anomalyService.getAnomaly(id),
    enabled,
  })
}

export const useAnomalyStats = () => {
  return useQuery({
    queryKey: ['anomaly-stats'],
    queryFn: () => anomalyService.getAnomalyStats(),
  })
}
