import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { store } from '../../app/store';
import { LoginFeature } from '../../features/login';
import { getApiConfig } from './api';

const { BASE_URL, DEBUG } = getApiConfig();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    if (!config.headers.Authorization) {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (DEBUG) {
      console.log(`[API Request]: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(`[API Response]: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        console.warn('Сессия истекла (401). Чистим всё.');
        await AsyncStorage.multiRemove(['token', 'user']);
        delete api.defaults.headers.Authorization;
        store.dispatch(LoginFeature.actions.logout());
      }
    }
    return Promise.reject(error);
  }
);
