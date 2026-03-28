import React from 'react'
import type { MouseEvent, ReactNode } from 'react'

import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
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

// Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import Notifications from '@mui/icons-material/Notifications'
import Drafts from '@mui/icons-material/Drafts'
import Close from '@mui/icons-material/Close'
import BarChart from '@mui/icons-material/BarChart'
import Email from '@mui/icons-material/Email'
import { themeConfig, useSettings, type ThemeColor } from '@cap/platform-core'
import CustomAvatar, { CustomAvatarProps } from '@cap/module-auth/modules/user-directory/components/CustomAvatar'

// Util Imports
const getInitials = (string: string) =>
  string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

export type NotificationsType = {
  title: string
  subtitle: string
  time: string
  read: boolean
} & (
  | {
      avatarImage?: string
      avatarIcon?: never
      avatarText?: never
      avatarColor?: never
      avatarSkin?: never
    }
  | {
      avatarIcon?: ReactNode | string
      avatarColor?: ThemeColor
      avatarSkin?: CustomAvatarProps['skin']
      avatarImage?: never
      avatarText?: never
    }
  | {
      avatarText?: string
      avatarColor?: ThemeColor
      avatarSkin?: CustomAvatarProps['skin']
      avatarImage?: never
      avatarIcon?: never
    }
)

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ overflowX: 'hidden', maxBlockSize: 420 }}>{children}</Box>
  } else {
    return (
      <PerfectScrollbar
        options={{ wheelPropagation: false, suppressScrollX: true }}
        style={{ maxBlockSize: 420 }}
      >
        {children}
      </PerfectScrollbar>
    )
  }
}

const getAvatar = (
  params: Pick<
    NotificationsType,
    'avatarImage' | 'avatarIcon' | 'title' | 'avatarText' | 'avatarColor' | 'avatarSkin'
  >,
) => {
  const { avatarImage, avatarIcon, avatarText, title, avatarColor, avatarSkin } = params

  if (avatarImage) {
    return <Avatar src={avatarImage} />
  } else if (avatarIcon) {
    let icon = avatarIcon

    if (typeof avatarIcon === 'string') {
      if (avatarIcon === 'tabler-mail') icon = <Email fontSize='small' />
      else if (avatarIcon === 'tabler-chart-bar') icon = <BarChart fontSize='small' />
      else icon = <i className={avatarIcon} />
    }

    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        {icon}
      </CustomAvatar>
    )
  } else {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        {avatarText || getInitials(title)}
      </CustomAvatar>
    )
  }
}

const NotificationDropdown = ({ notifications }: { notifications: Array<NotificationsType> }) => {
  // States
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [notificationsState, setNotificationsState] =
    React.useState<Array<NotificationsType>>(notifications)

  // Vars
  const open = Boolean(anchorEl)

  // Vars
  const notificationCount = notificationsState.filter((notification) => !notification.read).length
  const readAll = notificationsState.every((notification) => notification.read)

  // Refs

  // Hooks
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { settings } = useSettings()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prevAnchorEl) => (prevAnchorEl ? null : event.currentTarget))
  }

  // Read notification when notification is clicked
  const handleReadNotification = (
    event: MouseEvent<HTMLElement>,
    value: boolean,
    index: number,
  ) => {
    event.stopPropagation()
    const newNotifications = [...notificationsState]

    newNotifications[index].read = value
    setNotificationsState(newNotifications)
  }

  // Remove notification when close icon is clicked
  const handleRemoveNotification = (event: MouseEvent<HTMLElement>, index: number) => {
    event.stopPropagation()
    const newNotifications = [...notificationsState]

    newNotifications.splice(index, 1)
    setNotificationsState(newNotifications)
  }

  // Read or unread all notifications when read all icon is clicked
  const readAllNotifications = () => {
    const newNotifications = [...notificationsState]

    newNotifications.forEach((notification) => {
      notification.read = !readAll
    })
    setNotificationsState(newNotifications)
  }

  return (
    <>
      <IconButton onClick={handleToggle} sx={{ color: 'text.primary' }}>
        <Badge
          color='error'
          variant='dot'
          overlap='circular'
          invisible={notificationCount === 0}
          sx={{
            cursor: 'pointer',
            '& .MuiBadge-dot': {
              top: 6,
              right: 5,
              boxShadow: 'var(--mui-palette-background-paper) 0px 0px 0px 2px',
            },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Notifications />
        </Badge>
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
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top',
            }}
          >
            <Paper
              sx={{
                ...(settings.skin === 'bordered'
                  ? { border: 1, boxShadow: 'none' }
                  : { boxShadow: 'lg' }),
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
                      Notifications
                    </Typography>
                    {notificationCount > 0 && (
                      <Chip size='small' color='primary' label={`${notificationCount} New`} />
                    )}
                    <Tooltip
                      title={readAll ? 'Mark all as unread' : 'Mark all as read'}
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
                      {notificationsState.length > 0 ? (
                        <IconButton
                          size='small'
                          onClick={() => readAllNotifications()}
                          sx={{ color: 'text.primary' }}
                        >
                          {readAll ? <Email fontSize='small' /> : <Drafts fontSize='small' />}
                        </IconButton>
                      ) : (
                        <></>
                      )}
                    </Tooltip>
                  </Box>
                  <Divider />
                  <ScrollWrapper hidden={hidden}>
                    {notificationsState.map((notification, index) => {
                      const {
                        title,
                        subtitle,
                        time,
                        read,
                        avatarImage,
                        avatarIcon,
                        avatarText,
                        avatarColor,
                        avatarSkin,
                      } = notification

                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            paddingBlock: 3,
                            paddingInline: 4,
                            gap: 3,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                            '&:hover .group-visible': {
                              visibility: 'visible',
                            },
                            ...(index !== notificationsState.length - 1 && {
                              borderBlockEnd: '1px solid var(--mui-palette-divider)',
                            }),
                          }}
                          onClick={(e) => handleReadNotification(e, true, index)}
                        >
                          {getAvatar({
                            avatarImage,
                            avatarIcon,
                            title,
                            avatarText,
                            avatarColor,
                            avatarSkin,
                          })}
                          <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: 500, marginBlockEnd: 1 }}
                              color='text.primary'
                            >
                              {title}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                              sx={{ marginBlockEnd: 2 }}
                            >
                              {subtitle}
                            </Typography>
                            <Typography variant='caption' color='text.disabled'>
                              {time}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              gap: 2,
                            }}
                          >
                            <Badge
                              variant='dot'
                              color={read ? 'secondary' : 'primary'}
                              onClick={(e) => handleReadNotification(e, !read, index)}
                              sx={{
                                marginBlockStart: 1,
                                marginInlineEnd: 1,
                                ...(read && {
                                  visibility: 'hidden',
                                  '.MuiBox-root:hover &': {
                                    visibility: 'visible',
                                  },
                                }),
                              }}
                              className={read ? 'group-visible' : ''}
                            />
                            <IconButton
                              size='small'
                              className='group-visible'
                              sx={{
                                visibility: read ? 'hidden' : 'visible',
                              }}
                              onClick={(e) => handleRemoveNotification(e, index)}
                            >
                              <Close fontSize='small' />
                            </IconButton>
                          </Box>
                        </Box>
                      )
                    })}
                  </ScrollWrapper>
                  <Divider />
                  <Box sx={{ p: 4 }}>
                    <Button fullWidth variant='contained' size='small'>
                      View All Notifications
                    </Button>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default NotificationDropdown

