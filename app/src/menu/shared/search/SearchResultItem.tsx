import { Fragment, forwardRef, useMemo } from 'react'
import type { Ref } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ActionId, ActionImpl } from 'kbar'
import { i18n as i18nConfig } from '@cap/platform-core'
import type { SearchData } from './searchData'

type Locale = (typeof i18nConfig)['locales'][number]

const getLocalizedUrl = (url: string, locale: string): string => {
  if (!locale) return url
  return locale === i18nConfig.defaultLocale ? url : `/${locale}${url}`
}

const Title = ({ title, flexGrow = false }: { title: string; flexGrow?: boolean }) => {
  return (
    <Typography
      component='span'
      sx={{
        flexGrow: flexGrow ? 1 : 0,
        fontSize: '15px',
        lineHeight: 1.4667,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {title}
    </Typography>
  )
}

const TitleWithAncestors = ({
  title,
  flexGrow = false,
  ancestors,
}: {
  title: string
  flexGrow?: boolean
  ancestors: ActionImpl[]
}) => {
  if (ancestors.length === 0) return <Title title={title} flexGrow={flexGrow} />

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2 }}>
      {ancestors.map((ancestor: ActionImpl) => (
        <Fragment key={ancestor.id}>
          <Box component='span' sx={{ opacity: 0.5 }}>
            {ancestor.name}
          </Box>
          <span>&rsaquo;</span>
        </Fragment>
      ))}
      <Title title={title} flexGrow={flexGrow} />
    </Box>
  )
}

const Shortcut = ({ shortcut }: { shortcut: string[] }) => {
  const kbdSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 0.5,
    fontSize: '0.875rem',
    bgcolor: 'action.selected',
  }

  if (shortcut.length > 1) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {shortcut.map((sc) => (
          <Box component='kbd' key={sc} sx={kbdSx}>
            {sc}
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box component='kbd' sx={kbdSx}>
      {shortcut[0]}
    </Box>
  )
}

const EnterComponent = ({
  active,
  currentPath,
  data,
  locale,
}: {
  active: boolean
  currentPath: string
  data: SearchData
  locale: Locale
}) => {
  const theme = useTheme()
  const isCurrentPath = currentPath === getLocalizedUrl(data.url, locale as Locale)

  return (
    active && (
      <Box
        component='i'
        className={
          theme.direction === 'ltr' ? 'tabler-corner-down-left' : 'tabler-corner-down-right'
        }
        sx={{
          fontSize: '1.25rem',
          ...(isCurrentPath && { color: 'primary.main' }),
        }}
      />
    )
  )
}

const SearchResultItem = forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
      currentPath,
      data,
    }: {
      action: ActionImpl
      active: boolean
      currentRootActionId: ActionId | undefined | null
      currentPath: string
      data: SearchData
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    // Hooks
    const { lang: locale } = useParams<{ lang?: string }>()

    const ancestors = useMemo(() => {
      if (!currentRootActionId) return action.ancestors

      const index = action.ancestors.findIndex((ancestor) => ancestor.id === currentRootActionId)

      return action.ancestors.slice(index + 1)
    }, [action.ancestors, currentRootActionId])

    const isCurrentPath = currentPath === getLocalizedUrl(data.url, locale || '')

    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          position: 'relative',
          paddingBlock: 2,
          paddingInline: 4,
          cursor: 'pointer',
          borderRadius: 1,
          ...(active && !isCurrentPath && { bgcolor: 'action.selected' }),
          ...(!active &&
            isCurrentPath && {
              bgcolor: 'primary.lightOpacity',
              color: 'primary.main',
            }),
          ...(active &&
            isCurrentPath && {
              bgcolor: 'primary.mainOpacity',
              color: 'primary.main',
            }),
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2, fontSize: '0.875rem' }}
        >
          {action.icon && (
            <Box component='i' className={action.icon as string} sx={{ fontSize: '1.25rem' }} />
          )}
          {action.name &&
            (action.subtitle ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <TitleWithAncestors title={action.name} ancestors={ancestors} />
                {action.subtitle && (
                  <Typography
                    component='span'
                    sx={{
                      fontSize: '13px',
                      lineHeight: 1.538462,
                      color: 'text.secondary',
                    }}
                  >
                    {action.subtitle}
                  </Typography>
                )}
              </Box>
            ) : (
              <TitleWithAncestors flexGrow title={action.name} ancestors={ancestors} />
            ))}
        </Box>
        <EnterComponent
          active={active}
          currentPath={currentPath}
          data={data}
          locale={(locale || '') as Locale}
        />
        {action.shortcut?.length && <Shortcut shortcut={action.shortcut} />}
      </Box>
    )
  },
)

SearchResultItem.displayName = 'SearchResultItem'

export default SearchResultItem
