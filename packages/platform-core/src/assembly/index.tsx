import React from 'react'
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom'
import { CAPModule } from '../types'

interface AssembleAppProps {
    modules: CAPModule[]
}

export const assembleApp = ({ modules }: AssembleAppProps) => {
    // Aggregate all routes from modules
    const rootRoutes: RouteObject[] = []

    modules.forEach((module) => {
        if (module.routes) {
            rootRoutes.push(...module.routes)
        }
    })

    // Create router
    const router = createBrowserRouter(rootRoutes)

    // Return the App component that renders the RouterProvider
    const App = () => {
        return <RouterProvider router={router} />
    }

    return App
}
