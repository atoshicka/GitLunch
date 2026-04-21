import axios, { AxiosInstance } from 'axios';
import { LoginResponse } from '../../entities/api/types/login-types';
import { API_ENDPOINTS } from './api';
import {
  AddCartItemPayload,
  BackendCartItem,
  BackendCartResponse,
  UpdateCartItemPayload,
} from './types/cart-types';
import { PromoDish, Restaurant } from './types/home-types';
import { Dish, DishCategory, MenuByDayResponse } from './types/menu-types';
import {
  BackendOrder,
  BackendOrderStatus,
  ConfirmPickupResponse,
  CreateOrderPayload,
  CreateOrderResponse,
} from './types/order-types';
import { BackendRestaurantProfile } from './types/restaurant-types';

export const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';

const normalizeDish = (dish: Dish): Dish => {
  const rawImage = dish.image_url;
  const fullImageUrl = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${BASE_URL}${rawImage}`
    : undefined;

  const normalized: Dish = {
    ...dish,
    imageUrl: fullImageUrl,
  };

  if (!normalized.category) {
    const categories = normalized.categories ?? [];
    const primary = categories.find((c) => c.name.toLowerCase() !== 'акции') ?? categories[0];
    normalized.category = primary ?? { id: 0, name: '' };
  }

  return normalized;
};

export const createApiService = (api: AxiosInstance) => ({
  async getDishes(): Promise<Dish[]> {
    try {
      const response = await api.get<Dish[] | { menu_items: Dish[] }>(API_ENDPOINTS.DISHES);
      const dishes: Dish[] = Array.isArray(response.data)
        ? response.data
        : (response.data.menu_items ?? []);
      return dishes.map(normalizeDish);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      throw error;
    }
  },

  async getDishesByCategory(categoryId: string): Promise<Dish[]> {
    try {
      const response = await api.get<Dish[] | { menu_items: Dish[] }>(
        API_ENDPOINTS.DISHES_BY_CATEGORY(categoryId)
      );
      const dishes: Dish[] = Array.isArray(response.data)
        ? response.data
        : (response.data.menu_items ?? []);
      return dishes.map(normalizeDish);
    } catch (error) {
      console.error(`Error fetching dishes for category ${categoryId}:`, error);
      throw error;
    }
  },

  async getCategories(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await api.get<
        { id: number; name: string }[] | { categories: { id: number; name: string }[] }
      >(API_ENDPOINTS.CATEGORIES);
      if (Array.isArray(response.data)) return response.data;
      return response.data.categories ?? [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getDishById(id: string): Promise<Dish> {
    try {
      const response = await api.get<Dish | { menu_item: Dish }>(API_ENDPOINTS.DISH_DETAIL(id));
      const dish: Dish = 'menu_item' in response.data ? response.data.menu_item : response.data;
      return normalizeDish(dish);
    } catch (error) {
      console.error(`Error fetching dish ${id}:`, error);
      throw error;
    }
  },

  async searchDishes(query: string): Promise<Dish[]> {
    try {
      const response = await api.get<Dish[] | { menu_items: Dish[] }>(
        `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`
      );
      const dishes: Dish[] = Array.isArray(response.data)
        ? response.data
        : (response.data.menu_items ?? []);
      return dishes.map(normalizeDish);
    } catch (error) {
      console.error(`Error searching dishes with query "${query}":`, error);
      throw error;
    }
  },

  async getRestaurants(): Promise<Restaurant[]> {
    return [
      { id: '1', name: 'Цезарь' },
      { id: '2', name: 'Ресторан 2' },
    ];
  },

  async getPromoDishes(): Promise<PromoDish[]> {
    try {
      const response = await api.get<Dish[] | { menu_items: Dish[] }>(API_ENDPOINTS.DISHES);
      const dishes: Dish[] = Array.isArray(response.data)
        ? response.data
        : (response.data.menu_items ?? []);
      const allDishes = dishes.map(normalizeDish);
      return allDishes
        .filter((dish) => {
          const cats: DishCategory[] = dish.categories ?? [];
          return cats.some((c) => {
            const catName = c.name?.toLowerCase() ?? '';
            return catName === 'акции' || catName === 'promo' || catName === 'акция';
          });
        })
        .map(
          (dish): PromoDish => ({
            id: dish.id,
            name: dish.name,
            price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price,
            imageUrl: dish.imageUrl,
            imageSvg: dish.imageSvg,
            isPromo: true,
          })
        );
    } catch (error) {
      console.error('Error fetching promo dishes:', error);
      throw error;
    }
  },

  async getMenuByDays(): Promise<MenuByDayResponse[]> {
    try {
      const response = await api.get<MenuByDayResponse[]>(API_ENDPOINTS.MENU_BY_DAYS);
      return response.data.map((day) => ({
        ...day,
        items: day.items.map(normalizeDish),
      }));
    } catch (error) {
      console.error('Error fetching menu by days:', error);
      throw error;
    }
  },

  async getOrderDetails(orderId: number): Promise<BackendOrder> {
    const response = await api.get<BackendOrder>(API_ENDPOINTS.ORDER_DETAIL(String(orderId)));
    return response.data;
  },

  async login(login: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, { login, password });
    return response.data;
  },

  async getRestaurantProfile(): Promise<BackendRestaurantProfile> {
    const response = await api.get<BackendRestaurantProfile>(API_ENDPOINTS.RESTAURANT_PROFILE);
    return response.data;
  },

  async getCart(): Promise<BackendCartResponse> {
    const response = await api.get<BackendCartResponse>(API_ENDPOINTS.CART);
    return response.data;
  },

  async destroyAllOrders(): Promise<void> {
    await api.delete(API_ENDPOINTS.ORDERS_DESTROY_ALL);
  },

  async addCartItem(menuItemId: number, quantity: number, deliveryDate?: string): Promise<void> {
    const payload: AddCartItemPayload = {
      menu_item_id: menuItemId,
      quantity,
      ...(deliveryDate ? { delivery_date: deliveryDate } : {}),
    };
    await api.post(API_ENDPOINTS.CART_ITEMS, payload);
  },

  async updateCartItem(cartItemId: number, quantity: number): Promise<BackendCartItem> {
    const payload: UpdateCartItemPayload = { quantity };
    const response = await api.patch<BackendCartItem>(
      API_ENDPOINTS.CART_ITEM(String(cartItemId)),
      payload
    );
    return response.data;
  },

  async deleteCartItem(cartItemId: number): Promise<void> {
    await api.delete(API_ENDPOINTS.CART_ITEM(String(cartItemId)));
  },

  async getOrders(): Promise<BackendOrder[]> {
    const response = await api.get<BackendOrder[]>(API_ENDPOINTS.ORDERS);
    return response.data;
  },

  async createOrder(payload?: CreateOrderPayload): Promise<CreateOrderResponse> {
    const response = await api.post<CreateOrderResponse>(API_ENDPOINTS.ORDERS, payload ?? {});
    return response.data;
  },

  async getOrderStatus(orderId: number): Promise<BackendOrderStatus> {
    const response = await api.get<BackendOrderStatus>(`${API_ENDPOINTS.ORDERS}/${orderId}/status`);
    return response.data;
  },

  async confirmPickup(orderId: number): Promise<ConfirmPickupResponse> {
    const response = await api.post<ConfirmPickupResponse>(
      `${API_ENDPOINTS.ORDERS}/${orderId}/confirm_pickup`
    );
    return response.data;
  },
});

export type ApiService = ReturnType<typeof createApiService>;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const apiService = createApiService(axiosInstance);
