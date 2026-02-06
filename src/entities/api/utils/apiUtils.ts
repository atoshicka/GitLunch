/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../config/axiosConfig';

// Утилиты для работы с API
export const apiUtils = {
  // Обертка для GET запросов
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await api.get(url, { params });
    return response.data;
  },

  // Обертка для POST запросов
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await api.post(url, data);
    return response.data;
  },

  // Обертка для PUT запросов
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await api.put(url, data);
    return response.data;
  },

  // Обертка для DELETE запросов
  async delete<T>(url: string): Promise<T> {
    const response = await api.delete(url);
    return response.data;
  },

  // Установка токена авторизации
  setAuthToken(token: string | null) {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  },

  // Очистка всех заголовков
  clearHeaders() {
    api.defaults.headers.common = {};
  },
};
