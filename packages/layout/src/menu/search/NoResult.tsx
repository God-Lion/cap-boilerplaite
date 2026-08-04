import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Box, Typography, List, ListItem } from '@mui/material'
import { useKBar } from 'kbar'
import { useTranslation } from 'react-i18next'
import { i18n as i18nConfig, getSearchItems } from '@cap/platform-core'

const getLocalizedUrl = (url: string, locale: string): string => {
  if (!locale) return url
  return locale === i18nConfig.defaultLocale ? url : `/${locale}${url}`
}

type NoResultProps = {
  query: string | undefined
}

const NoResult = (props: NoResultProps) => {
  const { query } = props
  const { t } = useTranslation()
  const { query: kbarQuery } = useKBar()
  const { lang: locale } = useParams<{ lang?: string }>()

  const suggestions = React.useMemo(() => {
    const items = getSearchItems().slice(0, 3)
    return items.map((item) => {
      const rawName = item.name || ''
      const cleanNameKey = rawName.replace(/^navigation\./, '')
      const translatedName = t(rawName, {
        defaultValue: t(`navigation.${cleanNameKey}`, { defaultValue: rawName }),
      })
      return {
        id: item.id,
        label: translatedName,
        href: item.url,
        icon: item.icon,
      }
    })
  }, [t])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        flexWrap: 'wrap',
        paddingBlock: 14,
        paddingInline: 16,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          component='i'
          className='tabler-file-unknown'
          sx={{ fontSize: '64px', marginBlockEnd: 2.5 }}
        />
        <Typography
          sx={{
            fontSize: '1.125rem',
            fontWeight: 500,
            lineHeight: 1.55556,
            marginBlockEnd: 11,
          }}
        >
          {t('search.no_results', { query, defaultValue: `No result for "${query}"` })}
        </Typography>
        <Typography
          sx={{
            fontSize: '15px',
            lineHeight: 1.4667,
            marginBlockEnd: 4,
            color: 'text.disabled',
          }}
        >
          {t('search.try_searching_for', { defaultValue: 'Try searching for' })}
        </Typography>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 0 }}>
          {suggestions.map((item) => (
            <ListItem key={item.id} sx={{ display: 'flex', alignItems: 'center', p: 0 }}>
              <Box
                component={Link}
                to={getLocalizedUrl(item.href, locale || '')}
                onClick={kbarQuery.toggle}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': { color: 'primary.main' },
                  '&:focus-visible': { color: 'primary.main', outline: 0 },
                }}
              >
                {item.icon && (
                  <Box sx={{ display: 'flex', fontSize: '1.25rem', alignItems: 'center' }}>
                    {React.isValidElement(item.icon)
                      ? item.icon
                      : typeof item.icon === 'string' ? (
                          <Box component='i' className={item.icon} sx={{ fontSize: '1.25rem' }} />
                        ) : null}
                  </Box>
                )}
                <Typography
                  sx={{
                    fontSize: '15px',
                    lineHeight: 1.4667,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default NoResult
