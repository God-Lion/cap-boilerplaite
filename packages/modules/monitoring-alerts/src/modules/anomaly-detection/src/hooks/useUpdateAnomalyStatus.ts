import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AnomalyStatus } from '../../../../domain-kernel/src/types'
import { anomalyService } from '../services/AnomalyService'

export const useUpdateAnomalyStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AnomalyStatus }) => 
      anomalyService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomalies'] })
    },
  })
}

export const useMarkFalsePositive = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => anomalyService.markFalsePositive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomalies'] })
    },
  })
}
