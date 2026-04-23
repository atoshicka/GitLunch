import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderStatus } from '../../entities/api/types/order-types';

const STORAGE_KEY = 'orders_local_state_v5';

export interface PersistedOrdersState {
  removedOrderIds: number[];
  localStatuses: Record<number, { status: OrderStatus; statusLabel: string }>;
  lastKnownStatuses: Record<number, OrderStatus>;
  notifiedOrderIds: number[];
  lastSyncAt: string | null;
}

const defaultState: PersistedOrdersState = {
  removedOrderIds: [],
  localStatuses: {},
  lastKnownStatuses: {},
  notifiedOrderIds: [],
  lastSyncAt: null,
};

export const ordersPersistence = {
  async load(): Promise<PersistedOrdersState> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      const parsed = JSON.parse(raw) as PersistedOrdersState;

      const sanitizedStatuses: PersistedOrdersState['localStatuses'] = {};
      for (const [key, value] of Object.entries(parsed.localStatuses ?? {})) {
        const rawStatus = value.status as string;
        let status: OrderStatus = 'pending';
        if (rawStatus === 'ready') status = 'ready';
        else if (rawStatus === 'delivered') status = 'delivered';
        sanitizedStatuses[Number(key)] = { status, statusLabel: value.statusLabel };
      }

      const sanitizedLastKnown: PersistedOrdersState['lastKnownStatuses'] = {};
      for (const [key, value] of Object.entries(parsed.lastKnownStatuses ?? {})) {
        const rawStatus = value as string;
        let status: OrderStatus = 'pending';
        if (rawStatus === 'ready') status = 'ready';
        else if (rawStatus === 'delivered') status = 'delivered';
        sanitizedLastKnown[Number(key)] = status;
      }

      return {
        removedOrderIds: parsed.removedOrderIds ?? [],
        localStatuses: sanitizedStatuses,
        lastKnownStatuses: sanitizedLastKnown,
        notifiedOrderIds: parsed.notifiedOrderIds ?? [],
        lastSyncAt: parsed.lastSyncAt ?? null,
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
