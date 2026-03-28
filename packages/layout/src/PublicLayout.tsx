import React from 'react'
import { Box } from '@cap/theme'
import LayoutContent from './components/horizontal/LayoutContent'
import type { ChildrenType } from '@cap/platform-core'

const PublicLayout: React.FC<
  ChildrenType & {
    header?: React.ReactNode
    footer?: React.ReactNode
  }
> = ({ header, footer, children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Header Section - Dark background */}
      <Box
        sx={{
          color: 'white',
          width: '100%',
          zIndex: 1100,
        }}
      >
        {header || null}
      </Box>

      {/* Main Content Area - Coral/Red background */}
      <Box>
        <LayoutContent>{children}</LayoutContent>
      </Box>

      {/* Footer Section - Dark background */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {footer || null}
      </Box>
    </Box>
  )
}

export default PublicLayout
