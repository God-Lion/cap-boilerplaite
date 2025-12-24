import { RouteObject } from 'react-router-dom'
import { Dashboard } from '../screens/Dashboard'

export const userRoutes: RouteObject[] = [
    { path: '/dashboard', element: <Dashboard /> },
]

export default userRoutes
