import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { store } from '../../app/store';
import { LoginFeature } from '../../features/login';
import { getApiConfig } from './api';

const { BASE_URL, DEBUG } = getApiConfig();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (DEBUG) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        console.warn('Токен протух (401). Запускаем процесс выхода...');

        await AsyncStorage.multiRemove(['token', 'user']);

        store.dispatch(LoginFeature.actions.logout());
      }

      if (DEBUG) {
        const message = error.response?.data?.message ?? error.message;
        console.error(`API Error [${status}]:`, message);
      }
    }
    return Promise.reject(error);
  }
);

export const API_BASE_URL = BASE_URL;
