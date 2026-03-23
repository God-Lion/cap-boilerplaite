import { useQuery } from '@tanstack/react-query'
import type { AnomalyType } from '../../../../domain-kernel/src/types'
import type { BaselineData } from '../../../../domain-kernel/src/ports/IAnomalyDetector'
import { anomalyService } from '../services/AnomalyService'

export const useBaselineData = (userId: string, metric: AnomalyType, enabled = !!userId) => {
  return useQuery({
    queryKey: ['baseline', userId, metric],
    queryFn: () => anomalyService.getBaseline(userId, metric),
    enabled,
  })
}
