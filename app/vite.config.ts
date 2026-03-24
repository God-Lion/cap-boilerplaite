import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// __dirname = <boilerplate>/app
// workspaceRoot = <boilerplate>          (packages/, node_modules/ live here)
const workspaceRoot = path.resolve(__dirname, '..')

let vitePWA: ((options?: any) => Plugin | Plugin[]) | null = null
try {
  const require = createRequire(import.meta.url)
  require.resolve('vite-plugin-pwa')
  const mod = await import('vite-plugin-pwa')
  vitePWA = mod.VitePWA
} catch {
  console.warn('[vite.config] vite-plugin-pwa not found — PWA features disabled for this session.')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(vitePWA
      ? [
          vitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
              enabled: true,
            },
            workbox: {
              runtimeCaching: [
                {
                  urlPattern: /\.(?:js|css|json)$/i,
                  handler: 'StaleWhileRevalidate',
                  options: {
                    cacheName: 'static-assets',
                  },
                },
              ],
              // CRITICAL: never cache API routes
              navigateFallbackDenylist: [/^\/api\//],
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      // ── Specific sub-path aliases MUST come before the bare '@' catch-all ──
      '@/routes':  path.resolve(workspaceRoot, 'packages/modules/auth/src/routes'),
      '@/modules': path.resolve(workspaceRoot, 'packages/modules/auth/src/modules'),
      // ── Workspace source package aliases ─────────────────────────────────────
      '@cap/layout':          path.resolve(workspaceRoot, 'packages/layout/src'),
      '@cap/theme':           path.resolve(workspaceRoot, 'packages/theme/src'),
      '@cap/module-auth':     path.resolve(workspaceRoot, 'packages/modules/auth/src'),
      '@cap/module-admin':    path.resolve(workspaceRoot, 'packages/modules/admin/src'),
      '@cap/module-landing':  path.resolve(workspaceRoot, 'packages/modules/landing/src'),
      '@cap/module-mfa':      path.resolve(workspaceRoot, 'packages/modules/mfa/src'),
      '@cap/platform-core':   path.resolve(workspaceRoot, 'packages/platform-core/src'),
      // ── @auth/* sub-module aliases ────────────────────────────────────────────
      '@auth/authentication-core':  path.resolve(workspaceRoot, 'packages/modules/auth/src/modules/authentication-core'),
      '@auth/authorization-engine': path.resolve(workspaceRoot, 'packages/modules/auth/src/modules/authorization-engine'),
      '@auth/identity-broker':      path.resolve(workspaceRoot, 'packages/modules/auth/src/modules/identity-broker'),
      '@auth/mfa-orchestrator':     path.resolve(workspaceRoot, 'packages/modules/auth/src/modules/mfa-orchestrator'),
      '@auth/passwordless-service': path.resolve(workspaceRoot, 'packages/modules/auth/src/modules/passwordless-service'),
      '@auth/platform-cluster':     path.resolve(workspaceRoot, 'packages/modules/auth/src/modules/platform-cluster'),
      '@auth/session-manager':      path.resolve(workspaceRoot, 'packages/modules/auth/src/modules/session-manager'),
      '@auth/user-directory':       path.resolve(workspaceRoot, 'packages/modules/auth/src/modules/user-directory'),
      '@auth/domain-kernel':        path.resolve(workspaceRoot, 'packages/modules/auth/src/domain-kernel'),
      '@auth':                      path.resolve(workspaceRoot, 'packages/modules/auth/src'),
      '@idaas':                     path.resolve(workspaceRoot, 'packages/modules/auth/src/modules'),
      // ── App-local catch-alls (LAST — least specific) ──────────────────────────
      '@': path.resolve(__dirname, './src'),
      src: path.resolve(__dirname, './src'),
      app: path.resolve(__dirname, './src'),
    },
    dedupe: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-use',
      '@tanstack/react-query',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'zustand',
      '@cap/platform-core',
    ],
  },
  optimizeDeps: {
    // Exclude workspace source packages — they are TypeScript source-linked
    exclude: [
      '@cap/layout',
      '@cap/theme',
      '@cap/module-auth',
      '@cap/module-admin',
      '@cap/module-landing',
      '@cap/module-mfa',
      '@cap/platform-core',
    ],
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
