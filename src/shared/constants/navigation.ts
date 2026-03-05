export const TAB_NAMES = {
  HOME: 'Главная',
  MENU: 'Меню',
  BASKET: 'Корзина',
  ACCOUNT: 'Аккаунт',
} as const;

export const SCREEN_NAMES = {
  TABS: 'Tabs',
  SEARCH: 'Search',
} as const;

export type TabName = (typeof TAB_NAMES)[keyof typeof TAB_NAMES];

export const TAB_ICONS = {
  [TAB_NAMES.HOME]: '🏠',
  [TAB_NAMES.MENU]: '📋',
  [TAB_NAMES.BASKET]: '🛒',
  [TAB_NAMES.ACCOUNT]: '👤',
  default: '❓',
} as const;
