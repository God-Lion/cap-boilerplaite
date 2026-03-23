export default interface IPermission {
  id: number
  name: string
  slug?: string | null
  description?: string
  category?: string
  createdAt?: string
  updatedAt?: string
}
