import React from 'react'
import type { ReactElement } from 'react'
import {
  useSettings,
  useAppStore,
  useStateHydration,
  type AppStore,
  type SystemMode,
} from '@cap/platform-core'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import useLayoutInit from './hooks/useLayoutInit'

type LayoutWrapperProps = {
  systemMode: SystemMode
  verticalLayout: ReactElement
  horizontalLayout: ReactElement
  noLayout?: ReactElement
  publicLayout?: ReactElement
}
const LayoutWrapper = ({
  systemMode,
  verticalLayout,
  horizontalLayout,
  noLayout,
  publicLayout,
}: LayoutWrapperProps) => {
  const { settings } = useSettings()
  const { isHydrating } = useStateHydration()

  // Use direct selectors for better performance
  const layoutOverride = useAppStore((state: AppStore) => state.layoutOverride)

  useLayoutInit(systemMode)

  const isNoLayout = layoutOverride === 'noLayout'

  const isAdminLayout = React.useMemo(() => {
    // If we have an explicit override, respect it
    if (layoutOverride === 'admin') return true
    if (layoutOverride === 'public') return false

    return false
  }, [layoutOverride])

  if (isHydrating) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          blockSize: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

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
