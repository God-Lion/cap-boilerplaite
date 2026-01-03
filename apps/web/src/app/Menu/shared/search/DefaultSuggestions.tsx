import { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Box, Typography, List, ListItem } from '@mui/material'
import {
  TrendingUp,
  PieChart,
  ShoppingCart,
  Description,
  CalendarToday,
  Info,
  Receipt,
  Lock,
  Person,
  Settings,
  AttachMoney,
  Help,
  ViewQuilt,
  Checklist,
  CallMerge,
  BarChart,
} from '@mui/icons-material'
import { useKBar } from 'kbar'
import { i18n as i18nConfig } from '@cap/platform-core'

const getLocalizedUrl = (url: string, locale: string): string => {
  if (!locale) return url
  return locale === i18nConfig.defaultLocale ? url : `/${locale}${url}`
}

type DefaultSuggestionsType = {
  sectionLabel: string
  items: Array<{
    label: string
    href: string
    icon?: ReactNode
  }>
}

const defaultSuggestions: Array<DefaultSuggestionsType> = [
  {
    sectionLabel: 'Popular Searches',
    items: [
      {
        label: 'Analytics',
        href: '/dashboards/analytics',
        icon: <TrendingUp fontSize='small' />,
      },
      {
        label: 'CRM',
        href: '/dashboards/crm',
        icon: <PieChart fontSize='small' />,
      },
      {
        label: 'eCommerce',
        href: '/dashboards/ecommerce',
        icon: <ShoppingCart fontSize='small' />,
      },
      {
        label: 'User List',
        href: '/apps/user/list',
        icon: <Description fontSize='small' />,
      },
    ],
  },
  {
    sectionLabel: 'Apps',
    items: [
      {
        label: 'Calendar',
        href: '/apps/calendar',
        icon: <CalendarToday fontSize='small' />,
      },
      {
        label: 'Invoice List',
        href: '/apps/invoice/list',
        icon: <Info fontSize='small' />,
      },
      {
        label: 'User List',
        href: '/apps/user/list',
        icon: <Receipt fontSize='small' />,
      },
      {
        label: 'Roles & Permissions',
        href: '/apps/roles',
        icon: <Lock fontSize='small' />,
      },
    ],
  },
  {
    sectionLabel: 'Pages',
    items: [
      {
        label: 'User Profile',
        href: '/pages/user-profile',
        icon: <Person fontSize='small' />,
      },
      {
        label: 'Account Settings',
        href: '/pages/account-settings',
        icon: <Settings fontSize='small' />,
      },
      {
        label: 'Pricing',
        href: '/pages/pricing',
        icon: <AttachMoney fontSize='small' />,
      },
      {
        label: 'FAQ',
        href: '/pages/faq',
        icon: <Help fontSize='small' />,
      },
    ],
  },
  {
    sectionLabel: 'Forms & Charts',
    items: [
      {
        label: 'Form Layouts',
        href: '/forms/form-layouts',
        icon: <ViewQuilt fontSize='small' />,
      },
      {
        label: 'Form Validation',
        href: '/forms/form-validation',
        icon: <Checklist fontSize='small' />,
      },
      {
        label: 'Form Wizard',
        href: '/forms/form-wizard',
        icon: <CallMerge fontSize='small' />,
      },
      {
        label: 'Apex Charts',
        href: '/charts/apex-charts',
        icon: <BarChart fontSize='small' />,
      },
    ],
  },
]

const DefaultSuggestions = () => {
  // Hooks
  const { query } = useKBar()
  const { lang: locale } = useParams<{ lang?: string }>()

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        columnGap: '48px',
        rowGap: 8,
        paddingBlock: 14,
        paddingInline: 16,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {defaultSuggestions.map((section, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflowX: 'hidden',
            gap: 4,
            flexBasis: { xs: '100%', sm: 'calc((100% - 3rem) / 2)' },
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              lineHeight: 1.16667,
              textTransform: 'uppercase',
              color: 'text.disabled',
              letterSpacing: '0.8px',
            }}
          >
            {section.sectionLabel}
          </Typography>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 0 }}>
            {section.items.map((item, i) => (
              <ListItem key={i} sx={{ display: 'flex', p: 0 }}>
                <Box
                  component={Link}
                  to={getLocalizedUrl(item.href, locale || '')}
                  onClick={query.toggle}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    overflowX: 'hidden',
                    cursor: 'pointer',
                    gap: 2,
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': { color: 'primary.main' },
                    '&:focus-visible': { color: 'primary.main', outline: 0 },
                  }}
                >
                  {item.icon && (
                    <Box sx={{ display: 'flex', fontSize: '1.25rem' }}>{item.icon}</Box>
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
      ))}
    </Box>
  )
}

export default DefaultSuggestions
