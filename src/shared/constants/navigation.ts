export const TAB_NAMES = {
  HOME: 'Главная',
  MENU: 'Меню',
  BASKET: 'Корзина',
  ACCOUNT: 'Аккаунт',
  ORDERS: 'Orders',
  PAYMENT: 'Payment',
  SUCCESS: 'Success',
} as const;

export const SCREEN_NAMES = {
  TABS: 'Tabs',
  SEARCH: 'Search',
  ORDERS: 'Orders',
  PAYMENT: 'Payment',
  SUCCESS: 'Success',
} as const;

export type TabName = (typeof TAB_NAMES)[keyof typeof TAB_NAMES];
