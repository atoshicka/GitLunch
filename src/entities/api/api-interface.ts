import { AxiosInstance } from 'axios';
import { LoginResponse } from '../../entities/api/types/login-types';
import { API_ENDPOINTS } from './api';
import {
  AddCartItemPayload,
  BackendCart,
  BackendCartItem,
  BackendCartResponse,
  UpdateCartItemPayload,
} from './types/cart-types';
import { PromoDish, Restaurant } from './types/home-types';
import { Dish, DishCategory } from './types/menu-types';

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';

const normalizeDish = (dish: Dish): Dish => {
  if (dish.category) return dish;

  const categories = dish.categories ?? [];
  const primary = categories.find((c) => c.name.toLowerCase() !== 'акции') ?? categories[0];

  return {
    ...dish,
    category: primary ?? { id: 0, name: '' },
  };
};

export const createApiService = (api: AxiosInstance) => ({
  //Блюда

  async getDishes(): Promise<Dish[]> {
    try {
      const response = await api.get<Dish[] | { menu_items: Dish[] }>(API_ENDPOINTS.DISHES);
      console.log('DISHES RAW:', JSON.stringify(response.data).slice(0, 500));

      const dishes: Dish[] = Array.isArray(response.data)
        ? response.data
        : (response.data.menu_items ?? []);

      console.log('DISHES COUNT:', dishes.length);
      if (dishes.length > 0) {
        console.log('FIRST DISH:', JSON.stringify(dishes[0]));
      }

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

      if (Array.isArray(response.data)) {
        return response.data;
      }

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
        `${API_ENDPOINTS.DISHES}?search=${query}`
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

  //Рестораны

  async getRestaurants(): Promise<Restaurant[]> {
    return [
      { id: '1', name: 'Цезарь' },
      { id: '2', name: 'Ресторан 2' },
    ];
  },

  //Промо

  async getPromoDishes(): Promise<PromoDish[]> {
    const response = await api.get<Dish[] | { menu_items: Dish[] }>(API_ENDPOINTS.DISHES);

    const dishes: Dish[] = Array.isArray(response.data)
      ? response.data
      : (response.data.menu_items ?? []);

    const allDishes = dishes.map(normalizeDish);
    return allDishes
      .filter((dish: Dish) => {
        const cats: DishCategory[] = dish.categories ?? [];
        return cats.some((c) => {
          const name = c.name?.toLowerCase() ?? '';
          return name === 'акции' || name === 'promo' || name === 'акция';
        });
      })
      .map((dish: Dish) => ({
        id: String(dish.id),
        name: dish.name,
        price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price,
        imageUrl: dish.image_url ? `${BASE_URL}${dish.image_url}` : undefined,
        imageSvg: dish.imageSvg,
        isPromo: true,
      }));
  },

  //Авторизация

  async login(login: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, { login, password });
    return response.data;
  },

  //Корзина

  async getCart(): Promise<BackendCart> {
    const response = await api.get<BackendCart>(API_ENDPOINTS.CART);
    console.log('CART RESPONSE:', JSON.stringify(response.data));
    return response.data;
  },

  async addCartItem(menuItemId: number, quantity: number): Promise<BackendCartResponse> {
    const payload: AddCartItemPayload = { menu_item_id: menuItemId, quantity };
    const response = await api.post<BackendCartResponse>(API_ENDPOINTS.CART_ITEMS, payload);
    console.log('ADD CART ITEM RESPONSE:', JSON.stringify(response.data));
    return response.data;
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
});

export type ApiService = ReturnType<typeof createApiService>;
