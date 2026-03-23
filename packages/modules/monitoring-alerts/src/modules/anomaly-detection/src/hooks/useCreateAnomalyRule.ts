import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { IAlertRule, AlertSeverity, AlertCategory } from '../../../../domain-kernel/src/types'
import { alertService } from '../services/AlertService'

export interface CreateRulePayload {
  name: string
  description: string
  enabled: boolean
  severity: AlertSeverity
  category: AlertCategory
  conditions: IAlertRule['conditions']
  actions: IAlertRule['actions']
  cooldownMinutes: number
}

export const useCreateAnomalyRule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRulePayload) => alertService.createRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomaly-rules'] })
    },
  })
}
