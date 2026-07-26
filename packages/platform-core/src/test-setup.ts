import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [false, () => {}],
    updateServiceWorker: () => {},
  }),
}))
