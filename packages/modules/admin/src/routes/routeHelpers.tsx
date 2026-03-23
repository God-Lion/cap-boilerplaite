import React from 'react'
import { AdminRoute, AuthRoute } from '@cap/module-auth'
import { Roles } from '@cap/platform-core'

export const LayoutRouteWrapper = ({
  element,
  layout,
  ...props
}: {
  element: React.ReactNode
  layout?: any
  [key: string]: any
}) => {
  return <>{element}</>
}

export const adminRoute = (path: string, element: React.ReactNode, options: any = {}) => {
  return {
    path,
    element: <AdminRoute element={element} minimumRole={Roles.SUPERADMIN} layout="admin" />,
    ...options,
  }
}

export const authRoute = (path: string, element: React.ReactNode, options: any = {}) => {
  return {
    path,
    element: <AuthRoute element={element} {...options} />,
    ...options,
  }
}
