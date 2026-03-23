import type { IAlert, AlertChannel } from '../types'

// ─── Notification Dispatcher Port ────────────────────────────────────────────
export interface INotificationDispatcher {
  dispatch(alert: IAlert, channels: AlertChannel[]): Promise<DispatchResult>
  dispatchBatch(alerts: IAlert[], channels: AlertChannel[]): Promise<DispatchResult[]>
  testChannel(channel: AlertChannel, recipient: string): Promise<boolean>
}

export interface DispatchResult {
  alertId: string
  channel: AlertChannel
  success: boolean
  deliveredAt?: string
  error?: string
}
