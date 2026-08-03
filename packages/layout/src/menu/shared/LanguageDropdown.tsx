import React from 'react'
import {
  ClickAwayListener,
  Fade,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material'
import Translate from '@mui/icons-material/Translate'
import { i18n as i18nConfig } from '@cap/platform-core'
type Locale = (typeof i18nConfig)['locales'][number]
import { useTranslation } from 'react-i18next'
import { useSettings } from '@cap/platform-store'

type LanguageDataType = {
  langCode: Locale
  langName: string
}

// const getLocalePath = (pathName: string, locale: string): string => {
//   if (!pathName) return '/'
//   const segments = pathName.split('/')

//   segments[1] = locale

//   return segments.join('/')
// }

const languageData: Array<LanguageDataType> = [
  {
    langCode: 'en',
    langName: 'English',
  },
  {
    langCode: 'fr',
    langName: 'French',
  },
  {
    langCode: 'ar',
    langName: 'Arabic',
  },
]

const LanguageDropdown = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const [, i18n] = useTranslation('common')

  // Hooks
  const { settings } = useSettings()
  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((prevOpen) => !prevOpen)
  }
  const handleLangCode = (langCode: Locale) => {
    i18n.changeLanguage(langCode)

    handleClose()
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={handleToggle}
        sx={{
          color: 'text.primary',
        }}
      >
        <Translate />
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorEl}
        sx={{
          minInlineSize: '160px',
          marginBlockStart: '0.75rem !important',
          zIndex: 1,
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
              sx={{
                ...(settings.skin === 'bordered'
                  ? {
                    borderWidth: '1px',
                    // --tw-shadow: 0 0 #0000;
                    // --tw-shadow-colored: 0 0 #0000;
                    boxShadow:
                      'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
                  }
                  : {

                    boxShadow:
                      'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
                  }),
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  {languageData.map((locale) => (
                    <MenuItem
                      key={locale.langCode}
                      // component={Link}
                      // href={getLocalePath(pathName, locale.langCode)}
                      onClick={() => handleLangCode(locale.langCode)}
                      selected={i18n.language === locale.langCode}
                    >
                      {locale.langName}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </React.Fragment>
  )
}

export default LanguageDropdown
