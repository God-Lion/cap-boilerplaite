import React from 'react'
import {
  ClickAwayListener,
  Fade,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from '@mui/material'
import Brightness4 from '@mui/icons-material/Brightness4'
import Brightness7 from '@mui/icons-material/Brightness7'
import Laptop from '@mui/icons-material/Laptop'
import type { Mode } from '@cap/shared-types'
import { useSettings } from '@cap/platform-store'
import { zIndexScale } from '@cap/theme'
import { useTranslation } from 'react-i18next'

const ModeDropdown = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { settings, updateSettings } = useSettings()
  const { t } = useTranslation()

  const handleClose = () => {
    setOpen(false)
    setTooltipOpen(false)
    setAnchorEl(null)
  }

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((prevOpen) => !prevOpen)
  }

  const handleModeSwitch = (mode: Mode) => {
    handleClose()
    if (settings.mode !== mode) {
      updateSettings({ mode })
    }
  }

  const getModeIcon = (): React.JSX.Element => {
    if (settings.mode === 'system') return <Laptop />
    if (settings.mode === 'dark') return <Brightness4 />
    return <Brightness7 />
  }

  const getModeLabel = (): string => {
    if (settings.mode === 'system') return t('theme.system')
    if (settings.mode === 'dark') return t('theme.dark')
    return t('theme.light')
  }

  return (
    <React.Fragment>
      <Tooltip
        title={`${t('theme.switchMode')} ${getModeLabel()}`}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : tooltipOpen}
        PopperProps={{ className: 'capitalize' }}
      >
        <IconButton
          onClick={handleToggle}
          sx={{
            color: 'text.primary',
          }}
          aria-label={`${t('theme.switchMode')} ${getModeLabel()}`}
        >
          {getModeIcon()}
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorEl}
        sx={{
          minInlineSize: '160px',
          marginBlockStart: '0.75rem !important',
          zIndex: zIndexScale.dropdown,
        }}
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top',
            }}
          >
            <Paper
              className='glass-effect animate-scale-in'
              sx={{
                borderRadius: '12px !important',
                overflow: 'hidden',
                ...(settings.skin === 'bordered'
                  ? { border: 1, boxShadow: 'none' }
                  : { boxShadow: 'var(--premium-shadow)' }),
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  <MenuItem
                    onClick={() => handleModeSwitch('light')}
                    selected={settings.mode === 'light'}
                    sx={{
                      gap: '0.75rem',
                    }}
                  >
                    <Brightness7 sx={{ fontSize: '22px' }} />
                    {t('theme.light')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleModeSwitch('dark')}
                    selected={settings.mode === 'dark'}
                    sx={{
                      gap: '0.75rem',
                    }}
                  >
                    <Brightness4 sx={{ fontSize: '22px' }} />
                    {t('theme.dark')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleModeSwitch('system')}
                    selected={settings.mode === 'system'}
                    sx={{
                      gap: '0.75rem',
                    }}
                  >
                    <Laptop sx={{ fontSize: '22px' }} />
                    {t('theme.system')}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </React.Fragment>
  )
}

export default ModeDropdown
