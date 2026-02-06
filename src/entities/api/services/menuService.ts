import { api } from '../config/axiosConfig';
import { API_ENDPOINTS } from '../constants/api';
import { Dish, Category, MenuResponse } from '../types/menu';

import { MOCK_DISHES, MOCK_CATEGORIES } from '../constants/mocks';

export const menuService = {
  // Получить все блюда
  async getDishes(): Promise<Dish[]> {
    try {
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
      return MOCK_DISHES.filter((dish) => dish.category === categoryId);
    } catch (error) {
      console.error(`Error fetching dishes for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Получить все категории
  async getCategories(): Promise<Category[]> {
    try {
      return MOCK_CATEGORIES;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Получить блюдо по ID
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

  // Поиск блюд
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
};
