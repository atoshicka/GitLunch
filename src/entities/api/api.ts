export const getApiConfig = () => {
  if (__DEV__) {
    return {
      BASE_URL: 'https://gitlunch-backend-production.up.railway.app/api/v1',
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
  DISHES: '/menu_items',
  DISHES_BY_CATEGORY: (categoryId: string) => `/menu_items?category_id=${categoryId}`,
  CATEGORIES: '/categories',
  DISH_DETAIL: (id: string) => `/menu_items/${id}`,

  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,

  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/users/profile',

  CART: '/cart',
  CART_ITEM: (id: string) => `/cart/${id}`,
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
