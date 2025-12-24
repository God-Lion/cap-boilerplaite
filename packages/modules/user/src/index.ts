import { CAPModule } from '@cap/platform-core'
import { userRoutes } from './routes/routes'

export * from './screens/Dashboard'

export const UserModule: CAPModule = {
    id: 'user-module',
    version: '1.0.0',
    routes: userRoutes,
}
