// ─── Domain Events ────────────────────────────────────────────────────────────
export const MonitoringEventTypes = {
  ALERT_CREATED:          'monitoring.alert.created',
  ALERT_ACKNOWLEDGED:     'monitoring.alert.acknowledged',
  ALERT_RESOLVED:         'monitoring.alert.resolved',
  ALERT_ESCALATED:        'monitoring.alert.escalated',
  ANOMALY_DETECTED:       'monitoring.anomaly.detected',
  ANOMALY_CONFIRMED:      'monitoring.anomaly.confirmed',
  ANOMALY_FALSE_POSITIVE: 'monitoring.anomaly.false_positive',
  FRAUD_CASE_OPENED:      'monitoring.fraud.case_opened',
  FRAUD_CASE_CONFIRMED:   'monitoring.fraud.case_confirmed',
  FRAUD_CASE_CLEARED:     'monitoring.fraud.case_cleared',
  THREAT_INDICATOR_ADDED: 'monitoring.threat.indicator_added',
  RULE_TRIGGERED:         'monitoring.rule.triggered',
} as const

export type MonitoringEventType = (typeof MonitoringEventTypes)[keyof typeof MonitoringEventTypes]

export interface MonitoringDomainEvent<T = unknown> {
  type: MonitoringEventType
  payload: T
  occurredAt: string
  correlationId?: string
}
