import { Link, useParams } from 'react-router-dom'
import { Box, Typography, List, ListItem } from '@mui/material'
import { useKBar } from 'kbar'
import { i18n as i18nConfig } from '@cap/platform-core'

const getLocalizedUrl = (url: string, locale: string): string => {
  if (!locale) return url
  return locale === i18nConfig.defaultLocale ? url : `/${locale}${url}`
}

type NoResultProps = {
  query: string | undefined
}

type NoResultData = {
  label: string
  href: string
  icon: string
}

const noResultData: Array<NoResultData> = [
  {
    label: 'Analytics',
    href: '/dashboards/analytics',
    icon: 'tabler-chart-pie-2',
  },
  {
    label: 'User Profile',
    href: '/pages/user-profile',
    icon: 'tabler-user',
  },
  {
    label: 'CRM',
    href: '/dashboards/crm',
    icon: 'tabler-3d-cube-sphere',
  },
]

const NoResult = (props: NoResultProps) => {
  // Props
  const { query } = props

  // Hooks
  const { query: kbarQuery } = useKBar()
  const { lang: locale } = useParams<{ lang?: string }>()

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
          {`No result for "${query}"`}
        </Typography>
        <Typography
          sx={{
            fontSize: '15px',
            lineHeight: 1.4667,
            marginBlockEnd: 4,
            color: 'text.disabled',
          }}
        >
          Try searching for
        </Typography>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 0 }}>
          {noResultData.map((item, index) => (
            <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', p: 0 }}>
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
                <Box component='i' className={item.icon} sx={{ fontSize: '1.25rem' }} />
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
