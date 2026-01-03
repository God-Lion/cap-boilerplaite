import React from 'react'
import type { ReactElement } from 'react'
import type { SystemMode } from '@cap/platform-core'
import { useSettings } from '@cap/platform-core'
import Box from '@mui/material/Box'
import useLayoutInit from './hooks/useLayoutInit'
import { useLocation } from 'react-router-dom'
import { AuthModule } from '@cap/module-auth'

type LayoutWrapperProps = {
  systemMode: SystemMode
  verticalLayout: ReactElement
  horizontalLayout: ReactElement
  noLayout?: ReactElement
  publicLayout?: ReactElement
}

const ADMIN_PATH_PREFIXES = ['/admin', '/provider']

const LayoutWrapper = ({
  systemMode,
  verticalLayout,
  horizontalLayout,
  noLayout,
  publicLayout,
}: LayoutWrapperProps) => {
  const { settings } = useSettings()
  const { pathname } = useLocation()

  useLayoutInit(systemMode)

  const normalizedPath = pathname.toLowerCase()

  const isNoLayout = React.useMemo(() => {
    return (
      AuthModule.authRouteConfig?.some(
        (route) => route.layout === 'noLayout' && route.path.toLowerCase() === normalizedPath,
      ) ?? false
    )
  }, [normalizedPath])

  const isAdminLayout = React.useMemo(
    () => ADMIN_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix)),
    [normalizedPath],
  )

  if (isNoLayout) return noLayout ?? null

  if (isAdminLayout)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          backgroundColor: 'transparent',
        }}
        data-skin={settings.skin}
      >
        {settings.layout === 'horizontal' ? horizontalLayout : verticalLayout}
      </Box>
    )

  return publicLayout ?? null
}

export default LayoutWrapper
