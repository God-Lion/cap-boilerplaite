import { GlobalStyles } from '@mui/material'
import { zIndexScale } from './zIndex'

const GlobalZIndexStyles = () => {
  return (
    <GlobalStyles
      styles={{
        ':root': {
          '--z-behind': zIndexScale.local.behind,
          '--z-base': zIndexScale.local.base,
          '--z-above': zIndexScale.local.above,
          '--z-highlight': zIndexScale.local.highlight,
          '--z-overlay': zIndexScale.local.overlay,
          '--header-z-index': zIndexScale.layout.header,
          '--footer-z-index': zIndexScale.layout.footer,
          '--drawer-z-index': zIndexScale.layout.navigation,
          '--backdrop-z-index': zIndexScale.layout.backdrop,
          '--modal-z-index': zIndexScale.layout.modal,
        },
      }}
    />
  )
}

export default GlobalZIndexStyles
