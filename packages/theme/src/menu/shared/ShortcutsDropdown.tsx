import React, { ReactNode, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box,
  ClickAwayListener,
  Divider,
  Fade,
  IconButton,
  Paper,
  Popper,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import type { Theme } from '@mui/material/styles'

import PerfectScrollbar from 'react-perfect-scrollbar'
import GridView from '@mui/icons-material/GridView'
import Add from '@mui/icons-material/Add'
import CalendarToday from '@mui/icons-material/CalendarToday'
import FilePresent from '@mui/icons-material/FilePresent'
import Person from '@mui/icons-material/Person'
import People from '@mui/icons-material/People'
import DesktopWindows from '@mui/icons-material/DesktopWindows'
import Settings from '@mui/icons-material/Settings'
import { useSettings, themeConfig, i18n as i18nConfig } from '@cap/platform-core'
import CustomAvatar from '@cap/module-auth/modules/user-directory/components/CustomAvatar'

export type ShortcutsType = {
  url: string
  icon: string | ReactNode
  title: string
  subtitle: string
}

const getLocalizedUrl = (url: string, locale: string): string => {
  if (!locale) return url
  return locale === i18nConfig.defaultLocale ? url : `/${locale}${url}`
}

const getShortcutIcon = (icon: string | ReactNode): ReactNode => {
  if (typeof icon !== 'string') return icon

  if (icon === 'tabler-calendar') return <CalendarToday fontSize='small' />
  if (icon === 'tabler-file-dollar') return <FilePresent fontSize='small' />
  if (icon === 'tabler-user') return <Person fontSize='small' />
  if (icon === 'tabler-users-group') return <People fontSize='small' />
  if (icon === 'tabler-device-desktop-analytics') return <DesktopWindows fontSize='small' />
  if (icon === 'tabler-settings') return <Settings fontSize='small' />

  return <i className={icon} />
}

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ overflowX: 'hidden', maxBlockSize: 434 }}>{children}</Box>
  } else {
    return (
      <PerfectScrollbar
        options={{ wheelPropagation: false, suppressScrollX: true }}
        style={{ maxBlockSize: 434 }}
      >
        {children}
      </PerfectScrollbar>
    )
  }
}

const ShortcutsDropdown = ({ shortcuts }: { shortcuts: ShortcutsType[] }) => {
  // States
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Hooks
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { settings } = useSettings()
  const { i18n } = useTranslation()
  const locale = i18n.language

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleToggle = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((prevOpen) => !prevOpen)
  }, [])

  return (
    <>
      <IconButton onClick={handleToggle} sx={{ color: 'text.primary' }}>
        <GridView />
      </IconButton>
      <Popper
        open={open}
        transition
        placement='bottom-end'
        anchorEl={anchorEl}
        sx={{
          zIndex: 1,
          marginBlockStart: 3,
          inlineSize: isSmallScreen ? '100%' : 384,
        }}
        {...(isSmallScreen && {
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                padding: themeConfig.layoutPadding,
              },
            },
          ],
        })}
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}
          >
            <Paper
              sx={{
                ...(settings.skin === 'bordered'
                  ? { border: 1, boxShadow: 'none' }
                  : { boxShadow: 'var(--mui-customShadows-lg)' }),
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBlock: 3,
                      paddingInline: 4,
                      width: '100%',
                      gap: 2,
                    }}
                  >
                    <Typography variant='h6' sx={{ flex: '1 1 auto' }}>
                      Shortcuts
                    </Typography>
                    <Tooltip
                      title='Add Shortcut'
                      placement={placement === 'bottom-end' ? 'left' : 'right'}
                      slotProps={{
                        popper: {
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              transformOrigin:
                                placement === 'bottom-end'
                                  ? 'right center !important'
                                  : 'right center !important',
                            },
                          },
                        },
                      }}
                    >
                      <IconButton size='small' sx={{ color: 'text.primary' }}>
                        <Add fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Divider />
                  <ScrollWrapper hidden={hidden}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                      }}
                    >
                      {shortcuts.map((shortcut, index) => (
                        <Box
                          key={index}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                            // Vertical border for odd items (left column)
                            ...(index % 2 === 0 && {
                              borderInlineEnd: '1px solid var(--mui-palette-divider)',
                            }),
                            // Horizontal border for all except last row
                            ...(index < shortcuts.length - (shortcuts.length % 2 === 0 ? 2 : 1) && {
                              borderBlockEnd: '1px solid var(--mui-palette-divider)',
                            }),
                          }}
                        >
                          <Box
                            component={Link}
                            to={getLocalizedUrl(shortcut.url, locale)}
                            onClick={handleClose}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexDirection: 'column',
                              padding: 6,
                              gap: 3,
                              blockSize: '100%',
                              textDecoration: 'none',
                            }}
                          >
                            <CustomAvatar
                              size={50}
                              skin='light-static'
                              color='secondary'
                              sx={{ color: 'text.primary' }}
                            >
                              {getShortcutIcon(shortcut.icon)}
                            </CustomAvatar>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                              }}
                            >
                              <Typography sx={{ fontWeight: 500 }} color='text.primary'>
                                {shortcut.title}
                              </Typography>
                              <Typography variant='body2' color='text.secondary'>
                                {shortcut.subtitle}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </ScrollWrapper>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}
export default ShortcutsDropdown

