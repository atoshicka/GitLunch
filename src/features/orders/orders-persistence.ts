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
      const parsed = JSON.parse(raw) as PersistedOrdersState;

      const sanitizedStatuses: PersistedOrdersState['localStatuses'] = {};
      for (const [key, value] of Object.entries(parsed.localStatuses ?? {})) {
        const raw = value.status as string;
        const status: OrderStatus = raw === 'delivered' ? 'delivered' : 'pending';
        sanitizedStatuses[Number(key)] = { status, statusLabel: value.statusLabel };
      }

      return {
        removedOrderIds: parsed.removedOrderIds ?? [],
        localStatuses: sanitizedStatuses,
      };
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
