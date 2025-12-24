import { CAPModule } from '@cap/platform-core'
import { authRoutes } from './routes/routes'

export * from './hooks'
export * from './types'



export const AuthModule: CAPModule = {
    id: 'auth-module',
    version: '1.0.0',
    routes: authRoutes,
}

