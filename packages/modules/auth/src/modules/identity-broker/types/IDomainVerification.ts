export default interface IDomainVerification {
  id: number
  domain: string
  verificationToken: string
  verificationMethod: 'dns' | 'file'
  isVerified: boolean
  verifiedAt?: string | null
  createdAt?: string
  updatedAt?: string
}
