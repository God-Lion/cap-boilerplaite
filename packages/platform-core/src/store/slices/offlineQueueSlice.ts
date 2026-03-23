import { StateCreator } from 'zustand'
import { AppStore } from '..'

export interface OfflineQueueEntry {
  id: string
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  body: unknown
  timestamp: number
  retryCount: number
}

export interface OfflineQueueSlice {
  offlineQueue: OfflineQueueEntry[]
  addToOfflineQueue: (entry: Omit<OfflineQueueEntry, 'id' | 'timestamp' | 'retryCount'>) => void
  removeFromOfflineQueue: (id: string) => void
  incrementOfflineRetry: (id: string) => void
  clearOfflineQueue: () => void
}

export const createOfflineQueueSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  OfflineQueueSlice
> = (set) => ({
  offlineQueue: [],
  addToOfflineQueue: (entry) =>
    set((state: AppStore) => {
      state.offlineQueue.push({
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        retryCount: 0,
      })
    }),
  removeFromOfflineQueue: (id) =>
    set((state: AppStore) => {
      state.offlineQueue = state.offlineQueue.filter((e) => e.id !== id)
    }),
  incrementOfflineRetry: (id) =>
    set((state: AppStore) => {
      const entry = state.offlineQueue.find((e) => e.id === id)
      if (entry) {
        entry.retryCount += 1
      }
    }),
  clearOfflineQueue: () =>
    set((state: AppStore) => {
      state.offlineQueue = []
    }),
})
