export default interface ILinkedAccount {
  id: number
  userId: number
  provider: string
  providerId: string
  email?: string | null
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}
