export default interface IWebhook {
  id: number
  name: string
  url: string
  secret?: string
  events: Array<string>
  isActive: boolean
  lastTriggeredAt?: string | null
  failureCount?: number
  createdAt?: string
  updatedAt?: string
}
