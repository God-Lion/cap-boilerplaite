// client/src/types/profile.ts

export interface Profile {
  id: number
  name: string
  file_name?: string
  created_at: string
  is_active: boolean
  last_analyzed?: string
  skills?: string[]
  experience_years?: number
}

export interface ProfileDetail extends Profile {
  resume_text?: string
  education?: Record<string, any>
  certifications?: string[]
  desired_roles?: string[]
  preferred_locations?: string[]
  salary_expectation?: {
    min?: number
    max?: number
    currency?: string
  }
  analysis_results?: Record<string, any>
}
