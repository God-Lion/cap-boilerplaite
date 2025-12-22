// client/src/types/job.ts

export interface Job {
  id: number
  title: string
  company_name: string
  location: string
  description: string | null
  job_type: string | null
  experience_level: string | null
  salary_range: string | null
  posted_date: string | null
  match_score?: number
  application_status?: string | null
}

export interface JobSearchParams {
  query?: string
  location?: string
  company?: string
  date_posted?: 'all' | 'past_24_hours' | 'past_week' | 'past_month'
  skip?: number
  limit?: number
  q?: string
}

export interface JobSearch {
  query?: string
  location?: string
  company?: string
  date_posted?: 'all' | 'past_24_hours' | 'past_week' | 'past_month'
  skip?: number
  limit?: number
  job_type?: string
  experience_level?: string
  salary_range?: string
}

export interface JobApplicationPayload {
  profile_id: number
  cover_letter?: string
}

export interface JobApplication {
  id?: number
  application_id: number
  success: boolean
  message: string
}

export interface JobMatches {
  jobs: Job[]
  total: number
}
