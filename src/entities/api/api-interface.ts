import { AxiosInstance } from 'axios';
import { MOCK_CATEGORIES, MOCK_DISHES } from '../../../mocks';
import { API_ENDPOINTS } from './api';
import { PromoDish, Restaurant } from './types/home-types';
import { Category, Dish } from './types/menu-types';

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
      return MOCK_DISHES;
    } catch (error) {
      console.error('Error fetching dishes:', error);
      throw error;
    }
  },

  async getDishesByCategory(categoryId: string): Promise<Dish[]> {
    try {
      return MOCK_DISHES.filter((dish) => dish.category === categoryId);
    } catch (error) {
      console.error(`Error fetching dishes for category ${categoryId}:`, error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      return MOCK_CATEGORIES;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getDishById(id: string): Promise<Dish> {
    try {
      const dish = MOCK_DISHES.find((d) => d.id === id);
      if (!dish) throw new Error(`Dish with id ${id} not found`);
      return dish;
    } catch (error) {
      console.error(`Error fetching dish ${id}:`, error);
      throw error;
    }
  },

  async searchDishes(query: string): Promise<Dish[]> {
    try {
      return MOCK_DISHES.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query.toLowerCase()) ||
          dish.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error(`Error searching dishes with query "${query}":`, error);
      throw error;
    }
  },

  async getRestaurants(): Promise<Restaurant[]> {
    try {
      return [
        { id: '1', name: 'Цезарь' },
        { id: '2', name: 'Ресторан 2' },
      ];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  async getPromoDishes(): Promise<PromoDish[]> {
    try {
      return MOCK_DISHES.filter((dish) => dish.isPromo).map((dish) => ({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        imageUrl: dish.imageUrl,
        imageSvg: dish.imageSvg,
        isPromo: true,
      }));
    } catch (error) {
      console.error('Error fetching promo dishes:', error);
      throw error;
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
