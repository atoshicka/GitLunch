import { AxiosInstance } from 'axios';
import { PromoDish, Restaurant } from '../../entities/api/types/home-types';
import { Dish } from '../../entities/api/types/menu-types';
import { API_ENDPOINTS } from '../api';

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';

const extractArray = <T>(data: unknown, ...keys: string[]): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    for (const key of keys) {
      const val = (data as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val as T[];
    }
  }
  return [];
};

export const createApiService = (api: AxiosInstance) => ({
  async getDishes(): Promise<Dish[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DISHES);
      return extractArray<Dish>(response.data, 'menu_items', 'dishes', 'data', 'items');
    } catch (error) {
      console.error('Error fetching dishes:', error);
      throw error;
    }
  },

  async getDishesByCategory(categoryId: string): Promise<Dish[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DISHES_BY_CATEGORY(categoryId));
      return extractArray<Dish>(response.data, 'menu_items', 'dishes', 'data', 'items');
    } catch (error) {
      console.error(`Error fetching dishes for category ${categoryId}:`, error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return extractArray(response.data, 'categories', 'data', 'items');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getDishById(id: string): Promise<Dish> {
    try {
      const response = await api.get(API_ENDPOINTS.DISH_DETAIL(id));
      return response.data as Dish;
    } catch (error) {
      console.error(`Error fetching dish ${id}:`, error);
      throw error;
    }
  },

  async searchDishes(query: string): Promise<Dish[]> {
    try {
      const response = await api.get(`${API_ENDPOINTS.DISHES}?search=${query}`);
      return extractArray<Dish>(response.data, 'menu_items', 'dishes', 'data', 'items');
    } catch (error) {
      console.error(`Error searching dishes with query "${query}":`, error);
      throw error;
    }
  },

  async getRestaurants(): Promise<Restaurant[]> {
    // Пока заглушка
    return [
      { id: '1', name: 'Цезарь' },
      { id: '2', name: 'Ресторан 2' },
    ];
  },

  // Только этот метод меняем
  async getPromoDishes(): Promise<PromoDish[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DISHES);
      const allDishes = extractArray<Dish>(response.data, 'menu_items', 'dishes', 'data', 'items');

      // Фильтруем блюда из категории "Акции"
      const promoDishes = allDishes
        .filter((dish) => {
          const categoryName = dish.category?.name?.toLowerCase() || '';
          return categoryName === 'акции' || categoryName === 'promo' || categoryName === 'акция';
        })
        .map((dish) => ({
          id: String(dish.id),
          name: dish.name,
          price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price,
          imageUrl: dish.image_url ? `${BASE_URL}${dish.image_url}` : undefined,
          imageSvg: dish.imageSvg,
          isPromo: true,
        }));

      return promoDishes;
    } catch (error) {
      console.error('Error fetching promo dishes:', error);
      return [];
    }
  },

  async login(login: string, password: string) {
    const { data } = await api.post(API_ENDPOINTS.LOGIN, { login, password });
    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  },
});

export type ApiService = ReturnType<typeof createApiService>;
