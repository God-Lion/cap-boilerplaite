import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

import { VitePWA } from 'vite-plugin-pwa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      src: path.resolve(__dirname, './src'),
      app: path.resolve(__dirname, './src/app'),
      react: path.resolve(__dirname, '../../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../../node_modules/react-dom'),
      // 'react-router-dom': path.resolve(__dirname, '../../../node_modules/react-router-dom'),
      'react-use': path.resolve(__dirname, '../../../node_modules/react-use'),
      '@tanstack/react-query': path.resolve(__dirname, '../../../node_modules/@tanstack/react-query'),
    },
    dedupe: ['vite', 'react', 'react-dom', 'react-router-dom', 'react-use', '@tanstack/react-query', '@mui/material', '@emotion/react', '@emotion/styled'],
  },
  optimizeDeps: {
    include: ['immer'],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers.host) {
              proxyReq.setHeader('x-tenant-host', req.headers.host)
            }
          })
        },
      },
    },
  },
})
