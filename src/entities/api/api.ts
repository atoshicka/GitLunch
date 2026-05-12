export const getApiConfig = () => {
  if (__DEV__) {
    return {
      BASE_URL: 'https://gitlunch-backend-production.up.railway.app/api/v1',
      DEBUG: true,
    };
  }
  return {
    BASE_URL: 'https://gitlunch-backend-production.up.railway.app/api/v1',
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
  SEARCH: '/search',
  MENU_BY_DAYS: '/menu_by_days',

  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  ORDER_STATUS: (id: string) => `/orders/${id}/status`,
  ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,
  ORDER_CONFIRM_PICKUP: (id: string) => `/orders/${id}/confirm_pickup`,
  ORDERS_DESTROY_ALL: '/orders/destroy_all',

  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/users/profile',
  RESTAURANT_PROFILE: '/restaurant/profile',

  CART: '/cart',
  CART_ITEMS: '/cart/items',
  CART_ITEM: (id: string) => `/cart/items/${id}`,
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
