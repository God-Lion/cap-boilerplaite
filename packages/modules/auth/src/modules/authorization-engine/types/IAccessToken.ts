export default interface IAccessToken {
  id: number
  userId: number
  name: string
  token?: string
  abilities?: Array<string>
  lastUsedAt?: string | null
  expiresAt?: string | null
  createdAt?: string
  updatedAt?: string
}
