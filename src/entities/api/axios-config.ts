import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getApiConfig } from './api';

const { BASE_URL, DEBUG } = getApiConfig();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ← добавляем токен в каждый запрос
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (DEBUG) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      if (config.data) {
        console.log('Request Data:', config.data);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;
    console.error(`API Error [${status}]:`, message);
    error.customMessage = message;
    return Promise.reject(error);
  }
);

export const API_BASE_URL = BASE_URL;
