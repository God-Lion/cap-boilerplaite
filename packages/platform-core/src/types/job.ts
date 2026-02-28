export interface Job {
  id: number
  name: string
  status: string
  progress: number
  createdAt: string
}

export interface JobSearchParams {
  query?: string
  location?: string
  type?: string
}

export interface JobApplication {
  id: number
  jobId: number
  userId: string
  status: 'pending' | 'accepted' | 'rejected'
  appliedAt: string
}
