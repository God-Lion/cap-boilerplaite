import type { ElementType, ReactNode } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Box, IconButton, Typography } from '@mui/material'
import Search from '@mui/icons-material/Search'
import Close from '@mui/icons-material/Close'
import { useMedia } from 'react-use'
import { KBarProvider, KBarPortal, KBarPositioner, KBarSearch, useKBar, type KBarState } from 'kbar'
import SearchResults from './SearchResults'
import StyledKBarAnimator from './StyledKBarAnimator'
import type { ChildrenType } from '@cap/platform-core'
import { useSettings, i18n as i18nConfig, getSearchItems } from '@cap/platform-core'
import { useVerticalNav } from '../../hooks/useVerticalNav'
import { zIndexScale } from "@cap/theme";

export type Locale = (typeof i18nConfig)['locales'][number]

const getLocalizedUrl = (url: string, locale: string): string => {
  if (!locale) return url
  return locale === i18nConfig.defaultLocale ? url : `/${locale}${url}`
}

type ComponentWithUseKBarProps = Partial<ChildrenType> & {
  sx?: object
  icon?: ReactNode
  tag?: ElementType
  triggerClick?: boolean
}

const ComponentWithUseKBar = (props: ComponentWithUseKBarProps) => {
  const { children, sx, icon, tag, triggerClick = false } = props

  const { isBreakpointReached, isToggled, toggleVerticalNav } = useVerticalNav()

  const { query } = useKBar((state: KBarState) => {
    if (isBreakpointReached && isToggled && state.visualState === 'showing') {
      toggleVerticalNav(false)
    }
  })

  const Tag = tag || Box

  return (
    <Tag sx={sx} {...(triggerClick && { onClick: query.toggle })}>
      {icon || children}
    </Tag>
  )
}

const NavSearch = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathName = location.pathname
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const isSmallScreen = useMedia('(max-width: 600px)', false)
  const { lang: locale } = useParams<{ lang?: string }>()

  const dynamicSearchData = getSearchItems()

  const searchActions = dynamicSearchData.map((item) => ({
    ...item,
    url: undefined,
    perform: () =>
      item.url.startsWith('http')
        ? window.open(item.url, '_blank')
        : navigate(getLocalizedUrl(item.url, locale || '')),
  }))

  return (
    <KBarProvider actions={searchActions}>
      <ComponentWithUseKBar
        triggerClick
        sx={{ display: 'flex', cursor: 'pointer' }}
        {...((settings.layout === 'horizontal' || isBreakpointReached) && {
          icon: (
            <IconButton sx={{ color: 'text.primary' }}>
              <Search />
            </IconButton>
          ),
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ color: 'text.primary' }}>
            <Search />
          </IconButton>
          <Typography sx={{ whiteSpace: 'nowrap', color: 'text.disabled' }}>Search ⌘K</Typography>
        </Box>
      </ComponentWithUseKBar>
      <KBarPortal>
        <KBarPositioner
          style={{
            padding: 0,
            alignItems: 'center',
            zIndex: zIndexScale.search + 1,
          }}
        >
          <StyledKBarAnimator skin={settings.skin} isSmallScreen={isSmallScreen}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                paddingBlock: 5,
                paddingInline: 6,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <Search />
              </Box>
              <KBarSearch
                defaultPlaceholder=''
                name='search-input'
                style={{
                  flexGrow: 1,
                  minInlineSize: 0,
                  paddingBlock: '4px',
                  paddingInline: '6px',
                  fontSize: '16px',
                  outline: 'none',
                  border: 'none',
                  background: 'transparent',
                  color: 'inherit',
                  fontFamily: 'inherit',
                }}
              />
              <ComponentWithUseKBar sx={{ userSelect: 'none', color: 'text.disabled' }}>
                {`[esc]`}
              </ComponentWithUseKBar>
              <ComponentWithUseKBar
                triggerClick
                sx={{ display: 'flex', cursor: 'pointer' }}
                icon={<Close sx={{ fontSize: '22px', color: 'text.primary' }} />}
              />
            </Box>
            <SearchResults currentPath={pathName} data={dynamicSearchData} />
          </StyledKBarAnimator>
        </KBarPositioner>
        <Box
          role='button'
          aria-label='backdrop'
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: zIndexScale.search,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
      </KBarPortal>
    </KBarProvider>
  )
}

export default NavSearch
