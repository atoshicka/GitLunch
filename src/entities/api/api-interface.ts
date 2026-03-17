import { AxiosInstance } from 'axios';
import { PromoDish, Restaurant } from '../../entities/api/types/home-types';
import { Dish, DishCategory } from '../../entities/api/types/menu-types';
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
  async getDishes(): Promise<Dish[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DISHES);
      console.log('DISHES RAW:', JSON.stringify(response.data).slice(0, 500));
      const raw = extractArray<Dish>(response.data, 'menu_items', 'dishes', 'data', 'items');
      console.log('DISHES COUNT:', raw.length);
      if (raw.length > 0) {
        console.log('FIRST DISH:', JSON.stringify(raw[0]));
      }
      return raw.map(normalizeDish);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      throw error;
    }
  },

  async getDishesByCategory(categoryId: string): Promise<Dish[]> {
    try {
      const response = await api.get(API_ENDPOINTS.DISHES_BY_CATEGORY(categoryId));
      const raw = extractArray<Dish>(response.data, 'menu_items', 'dishes', 'data', 'items');
      return raw.map(normalizeDish);
    } catch (error) {
      console.error(`Error fetching dishes for category ${categoryId}:`, error);
      throw error;
    }
  },

  async getCategories(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES);
      if (Array.isArray(response.data)) {
        return response.data as { id: number; name: string }[];
      }
      return extractArray<{ id: number; name: string }>(
        response.data,
        'categories',
        'data',
        'items'
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getDishById(id: string): Promise<Dish> {
    try {
      const response = await api.get(API_ENDPOINTS.DISH_DETAIL(id));
      const data = response.data as Record<string, unknown>;
      const dish = (data.menu_item ?? data.dish ?? data) as Dish;
      return normalizeDish(dish);
    } catch (error) {
      console.error(`Error fetching dish ${id}:`, error);
      throw error;
    }
  },

  async searchDishes(query: string): Promise<Dish[]> {
    try {
      const response = await api.get(`${API_ENDPOINTS.DISHES}?search=${query}`);
      const raw = extractArray<Dish>(response.data, 'menu_items', 'dishes', 'data', 'items');
      return raw.map(normalizeDish);
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
      const response = await api.get(API_ENDPOINTS.DISHES);
      const raw = extractArray<Dish>(response.data, 'menu_items', 'dishes', 'data', 'items');
      const allDishes = raw.map(normalizeDish);

      return allDishes
        .filter((dish) => {
          const cats: DishCategory[] = dish.categories ?? [];
          return cats.some((c) => {
            const name = c.name?.toLowerCase() ?? '';
            return name === 'акции' || name === 'promo' || name === 'акция';
          });
        })
        .map((dish) => ({
          id: String(dish.id),
          name: dish.name,
          price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price,
          imageUrl: dish.image_url ? `${BASE_URL}${dish.image_url}` : undefined,
          imageSvg: dish.imageSvg,
          isPromo: true,
        }));
    } catch (error) {
      console.error('Error fetching promo dishes:', error);
      return [];
    }
  },

  async login(
    login: string,
    password: string
  ): Promise<{ success: boolean; token: string; user: unknown }> {
    const { data } = await api.post(API_ENDPOINTS.LOGIN, { login, password });
    return {
      success: true,
      token: data.token as string,
      user: data.user,
    };
  },
});

export type ApiService = ReturnType<typeof createApiService>;
