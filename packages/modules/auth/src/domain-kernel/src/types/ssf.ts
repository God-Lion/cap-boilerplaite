export interface SSFConfig {
  enabled?: boolean
  issuer?: string
  audience?: string
  delivery_method?: string
  events_supported?: string[]
  events_delivered?: string[]
  events_meta?: Array<{ id: string; name: string; desc: string }>
}

export interface BroadcastSSFEventRequest {
  eventType: string
  subject: string
  reason?: string
  payload?: Record<string, unknown>
}

export interface BroadcastSSFEventResponse {
  message: string
  event: unknown
  recipients: unknown[]
  deliveredAt?: string
}
