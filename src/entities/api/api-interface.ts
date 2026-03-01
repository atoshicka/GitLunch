import { AxiosInstance } from 'axios';
import { MOCK_CATEGORIES, MOCK_DISHES } from '../../../mocks';
import { API_ENDPOINTS } from './api';
import { PromoDish, Restaurant } from './types/home-types';
import { Category, Dish } from './types/menu-types';

export const createApiService = (api: AxiosInstance) => ({
  // методы меню

  // Получить все блюда
  async getDishes(): Promise<Dish[]> {
    try {
      // бэк:
      // const response = await api.get<{ dishes: Dish[] }>(API_ENDPOINTS.DISHES);
      // return response.data.dishes;

      // мок
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DISHES), 300);
      });
    } catch (error) {
      console.error('Error fetching dishes:', error);
      throw error;
    }
  },

  // Получить блюда по категории
  async getDishesByCategory(categoryId: string): Promise<Dish[]> {
    try {
      // бэк:
      // const response = await api.get<{ dishes: Dish[] }>(
      //   API_ENDPOINTS.DISHES_BY_CATEGORY(categoryId)
      // );
      // return response.data.dishes;

      // мок
      return MOCK_DISHES.filter((dish) => dish.category === categoryId);
    } catch (error) {
      console.error(`Error fetching dishes for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Получить все категории
  async getCategories(): Promise<Category[]> {
    try {
      // бэк
      // const response = await api.get<{ categories: Category[] }>(API_ENDPOINTS.CATEGORIES);
      // return response.data.categories;

      // мок
      return MOCK_CATEGORIES;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Получить блюдо по ID
  async getDishById(id: string): Promise<Dish> {
    try {
      // бэк
      // const response = await api.get<{ dish: Dish }>(API_ENDPOINTS.DISH_DETAIL(id));
      // return response.data.dish;

      // мок
      const dish = MOCK_DISHES.find((d) => d.id === id);
      if (!dish) throw new Error(`Dish with id ${id} not found`);
      return dish;
    } catch (error) {
      console.error(`Error fetching dish ${id}:`, error);
      throw error;
    }
  },

  // Поиск блюд
  async searchDishes(query: string): Promise<Dish[]> {
    try {
      // бэк
      // const response = await api.get<{ dishes: Dish[] }>(
      //   `${API_ENDPOINTS.DISHES}?search=${query}`
      // );
      // return response.data.dishes;

      // мок
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

  //методы логина
  async login(login: string, password: string) {
    const { data } = await api.post(API_ENDPOINTS.LOGIN, { login, password });
    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  },

  async getRestaurants(): Promise<Restaurant[]> {
    try {
      // TODO: заменить на реальный API
      // const response = await api.get<{ restaurants: Restaurant[] }>(API_ENDPOINTS.RESTAURANTS);
      // return response.data.restaurants;

      // мок
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
      // TODO: заменить на реальный API
      // const response = await api.get<{ promoDishes: PromoDish[] }>(API_ENDPOINTS.PROMO);
      // return response.data.promoDishes;

      // мок - берем из MOCK_DISHES с isPromo: true
      return MOCK_DISHES.filter((dish) => dish.isPromo).map((dish) => ({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        isPromo: true,
      }));
    } catch (error) {
      console.error('Error fetching promo dishes:', error);
      throw error;
    }
  },
});

// Тип для самого сервиса
export type ApiService = ReturnType<typeof createApiService>;
