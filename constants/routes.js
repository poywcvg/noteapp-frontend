export const APP_ROUTES = {
  home: '/',
  archived: '/archived',
  trash: '/trash',
  labels: '/labels',
  settings: '/settings',
  login: '/login',
  register: '/register',
}

export const SIDEBAR_ITEMS = [
  {
    title: 'همه یادداشت‌ها',
    to: APP_ROUTES.home,
    icon: 'notes',
  },
  {
    title: 'آرشیو',
    to: APP_ROUTES.archived,
    icon: 'archive',
  },
  {
    title: 'سطل زباله',
    to: APP_ROUTES.trash,
    icon: 'trash',
  },
  {
    title: 'برچسب‌ها',
    to: APP_ROUTES.labels,
    icon: 'tag',
  },
  {
    title: 'تنظیمات',
    to: APP_ROUTES.settings,
    icon: 'settings',
  },
]
