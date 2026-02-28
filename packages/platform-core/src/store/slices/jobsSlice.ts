import { StateCreator } from 'zustand'
import { Job, JobSearchParams, JobApplication } from '../../types/job'
import type { AppStore } from '../index'

export interface JobsSlice {
  jobs: Job[]
  savedJobs: Job[]
  applications: JobApplication[]
  searchFilters: JobSearchParams
  pagination: {
    skip: number
    limit: number
    total: number
  }
  setJobs: (jobs: Job[]) => void
  addJob: (job: Job) => void
  updateJob: (job: Job) => void
  deleteJob: (jobId: number) => void
  saveJob: (job: Job) => void
  unsaveJob: (jobId: number) => void
  addApplication: (application: JobApplication) => void
  updateApplication: (application: JobApplication) => void
  setSearchFilters: (filters: JobSearchParams) => void
  resetSearchFilters: () => void
}

export const createJobsSlice: StateCreator<AppStore, [['zustand/immer', never]], [], JobsSlice> = (
  set,
) => ({
  jobs: [],
  savedJobs: [],
  applications: [],
  searchFilters: {},
  pagination: {
    skip: 0,
    limit: 20,
    total: 0,
  },
  setJobs: (jobs: Job[]) => set({ jobs }),
  addJob: (job: Job) => set((state: JobsSlice) => ({ jobs: [...state.jobs, job] })),
  updateJob: (job: Job) =>
    set((state: JobsSlice) => ({
      jobs: state.jobs.map((j: Job) => (j.id === job.id ? job : j)),
    })),
  deleteJob: (jobId: number) =>
    set((state: JobsSlice) => ({
      jobs: state.jobs.filter((j: Job) => j.id !== jobId),
    })),
  saveJob: (job: Job) =>
    set((state: JobsSlice) => ({
      savedJobs: [...state.savedJobs, job],
    })),
  unsaveJob: (jobId: number) =>
    set((state: JobsSlice) => ({
      savedJobs: state.savedJobs.filter((job: Job) => job.id !== jobId),
    })),
  addApplication: (application: JobApplication) =>
    set((state: JobsSlice) => ({
      applications: [...state.applications, application],
    })),
  updateApplication: (application: JobApplication) =>
    set((state: JobsSlice) => ({
      applications: state.applications.map((a: JobApplication) =>
        a.id === application.id ? application : a,
      ),
    })),
  setSearchFilters: (filters: JobSearchParams) => set({ searchFilters: filters }),
  resetSearchFilters: () => set({ searchFilters: {} }),
})
