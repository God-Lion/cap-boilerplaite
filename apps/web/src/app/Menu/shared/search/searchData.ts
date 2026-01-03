export type SearchData = {
  id: string
  name: string
  url: string
  icon?: string
  section?: string
  shortcut?: string[]
  subtitle?: string
}

export const searchData: SearchData[] = [
  // Dashboards
  {
    id: '1',
    name: 'Analytics',
    url: '/dashboards/analytics',
    icon: 'tabler-trending-up',
    section: 'Dashboards',
  },
  {
    id: '2',
    name: 'CRM',
    url: '/dashboards/crm',
    icon: 'tabler-chart-pie-2',
    section: 'Dashboards',
  },
  {
    id: '3',
    name: 'eCommerce',
    url: '/dashboards/ecommerce',
    icon: 'tabler-shopping-cart',
    section: 'Dashboards',
  },
  // Apps
  {
    id: '4',
    name: 'Calendar',
    url: '/apps/calendar',
    icon: 'tabler-calendar',
    section: 'Apps',
  },
  {
    id: '5',
    name: 'Invoice List',
    url: '/apps/invoice/list',
    icon: 'tabler-file-info',
    section: 'Apps',
  },
  {
    id: '6',
    name: 'User List',
    url: '/apps/user/list',
    icon: 'tabler-users',
    section: 'Apps',
  },
  // Pages
  {
    id: '7',
    name: 'User Profile',
    url: '/pages/user-profile',
    icon: 'tabler-user',
    section: 'Pages',
  },
  {
    id: '8',
    name: 'Account Settings',
    url: '/pages/account-settings',
    icon: 'tabler-settings',
    section: 'Pages',
  },
  {
    id: '9',
    name: 'Pricing',
    url: '/pages/pricing',
    icon: 'tabler-currency-dollar',
    section: 'Pages',
  },
  {
    id: '10',
    name: 'FAQ',
    url: '/pages/faq',
    icon: 'tabler-help-circle',
    section: 'Pages',
  },
]
