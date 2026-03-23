// ─── Severity ────────────────────────────────────────────────────────────────
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

// ─── Status ──────────────────────────────────────────────────────────────────
export type AlertStatus = 'open' | 'acknowledged' | 'resolved' | 'suppressed' | 'expired'

// ─── Channel ─────────────────────────────────────────────────────────────────
export type AlertChannel = 'email' | 'sms' | 'webhook' | 'slack' | 'in_app' | 'pagerduty'

// ─── Alert ───────────────────────────────────────────────────────────────────
export interface IAlert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  status: AlertStatus
  category: AlertCategory
  source: AlertSource
  affectedUserId?: string
  affectedIp?: string
  affectedResource?: string
  metadata: Record<string, unknown>
  ruleId?: string
  anomalyId?: string
  fraudCaseId?: string
  createdAt: string
  updatedAt: string
  acknowledgedAt?: string
  acknowledgedBy?: string
  resolvedAt?: string
  resolvedBy?: string
  expiresAt?: string
}

export type AlertCategory =
  | 'authentication'
  | 'authorization'
  | 'fraud'
  | 'anomaly'
  | 'brute_force'
  | 'credential_stuffing'
  | 'account_takeover'
  | 'suspicious_activity'
  | 'data_exfiltration'
  | 'privilege_escalation'
  | 'impossible_travel'
  | 'bot_activity'
  | 'system'

export interface AlertSource {
  module: string
  detector: string
  eventType: string
}

// ─── Alert Rule ──────────────────────────────────────────────────────────────
export interface IAlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  severity: AlertSeverity
  category: AlertCategory
  conditions: RuleCondition[]
  actions: RuleAction[]
  cooldownMinutes: number
  createdAt: string
  updatedAt: string
  lastTriggeredAt?: string
  triggerCount: number
}

export interface RuleCondition {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'regex' | 'in'
  value: string | number | boolean | string[]
  logicalOperator?: 'AND' | 'OR'
}

export interface RuleAction {
  type: 'notify' | 'block_ip' | 'lock_account' | 'require_mfa' | 'create_ticket' | 'run_webhook'
  channel?: AlertChannel
  webhookUrl?: string
  recipients?: string[]
  params?: Record<string, unknown>
}
