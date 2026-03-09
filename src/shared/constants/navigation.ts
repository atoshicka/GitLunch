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
