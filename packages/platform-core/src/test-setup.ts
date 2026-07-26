import '@testing-library/jest-dom'
import { vi } from 'vitest'

process.env.VITE_STORAGE_ENCRYPTION_KEY = 'test-storage-encryption-key-32-bytes!'

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [false, () => {}],
    updateServiceWorker: () => {},
  }),
}))
