export const getApiConfig = () => {
  if (__DEV__) {
    return {
      BASE_URL: 'https://two-tools-boil.loca.lt/api/v1',
      DEBUG: true,
    };
  }

  return {
    BASE_URL: 'https://api.gitlunch.app/api/v1',
    DEBUG: false,
  };
};

export const API_CONFIG = {
  ...getApiConfig(),
  TIMEOUT: 10000,
  VERSION: 'v1',
} as const;

export const API_ENDPOINTS = {
  // Меню
  DISHES: '/dishes',
  DISHES_BY_CATEGORY: (categoryId: string) => `/dishes?category=${categoryId}`,
  CATEGORIES: '/categories',
  DISH_DETAIL: (id: string) => `/dishes/${id}`,

  // Заказы
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,

  // Пользователи
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/users/profile',

  // Корзина
  CART: '/cart',
  CART_ITEM: (id: string) => `/cart/${id}`,
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
