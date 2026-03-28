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
import ThemeBridge from './styles/ThemeBridge'

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
    if (layoutOverride === 'admin') return true
    if (layoutOverride === 'public') return false
    return false
  }, [layoutOverride])

  // While hydrating: render the actual layout tree invisibly behind a
  // transparent overlay. This prevents layout-shift / blink because the DOM
  // is already in its final state when we make it visible.
  // A centred spinner still floats on top so the user sees activity.
  if (isHydrating) {
    return (
      <Box sx={{ position: 'relative', minBlockSize: '100vh' }}>
        <ThemeBridge />
        {/* Invisible pre-render of final layout — eliminates pop-in */}
        <Box sx={{ visibility: 'hidden', pointerEvents: 'none' }}>
          {isNoLayout
            ? (noLayout ?? null)
            : isAdminLayout
              ? (
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
              : (publicLayout ?? null)}
        </Box>

        {/* Centered spinner overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--mui-palette-background-default, inherit)',
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  if (isNoLayout) return noLayout ?? null

  if (isAdminLayout)
    return (
      <>
        <ThemeBridge />
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
      </>
    )

  return publicLayout ?? null
}

export default LayoutWrapper
