export default interface IUserCredential {
  id: number
  userId: number
  credentialId: string
  publicKey: string
  counter: number
  name?: string
  createdAt?: string
  updatedAt?: string
}
