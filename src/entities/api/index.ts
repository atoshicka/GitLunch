// Экспорт сервисов
export { createApiService } from './api-interface';
export type { ApiService } from './api-interface';

// Экспорт типов
export type { PromoDish, Restaurant } from './types/home-types';
export type { LoginRequest, LoginResponse } from './types/login-types';
export type { Category, Dish } from './types/menu-types';

// Экспорт констант
export { API_ENDPOINTS } from './api';

// Экспорт конфигурации
export { api } from './axios-config';
