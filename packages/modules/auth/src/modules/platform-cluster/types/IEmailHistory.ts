export default interface IEmailHistory {
  id: number
  userId: number
  emailType: string
  sentTo: string
  subject?: string
  status: 'sent' | 'failed' | 'pending'
  createdAt?: string
}
