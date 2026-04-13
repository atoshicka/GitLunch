import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderStatus } from '../../entities/api/types/order-types';

const STORAGE_KEY = 'orders_local_state_v2';

export interface PersistedOrdersState {
  removedOrderIds: number[];
  localStatuses: Record<number, { status: OrderStatus; statusLabel: string }>;
}

const defaultState: PersistedOrdersState = {
  removedOrderIds: [],
  localStatuses: {},
};

export const ordersPersistence = {
  async load(): Promise<PersistedOrdersState> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      return JSON.parse(raw) as PersistedOrdersState;
    } catch {
      return defaultState;
    }
  },

  async save(state: PersistedOrdersState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  },
};
