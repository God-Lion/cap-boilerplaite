import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test-setup.ts'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@cap/layout': resolve(__dirname, '../layout/src'),
      '@cap/theme': resolve(__dirname, '../theme/src'),
      '@cap/platform-store': resolve(__dirname, '../platform-store/src'),
      '@cap/shared-types': resolve(__dirname, '../shared-types/src'),
      'virtual:pwa-register/react': resolve(__dirname, './src/stubs/pwa-stub.ts'),
    },
  },
})
