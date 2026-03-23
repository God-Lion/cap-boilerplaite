export default interface IAuditLog {
  id: number
  userId?: number | null
  impersonatedBy?: number | null
  action: string
  metadata?: Record<string, any> | null
  ipAddress?: string | null
  userAgent?: string | null
  isImpersonated?: boolean
  createdAt?: string
}
