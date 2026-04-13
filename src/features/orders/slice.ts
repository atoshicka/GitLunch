import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderStatus } from '../../entities/api/types/order-types';
import { Order, OrdersState } from './types';

const initialState: OrdersState = {
  orders: [],
  removedOrderIds: [],
  localStatuses: {},
  isLoading: false,
  isCreating: false,
  error: null,
};

export const { name, actions, reducer } = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrders: () => {},
    createOrder: () => {},
    cancelOrder: (_state, _action: PayloadAction<number>) => {},
    confirmPickup: (_state, _action: PayloadAction<number>) => {},
    pollOrderStatus: (_state, _action: PayloadAction<number>) => {},
    restorePersistedState: (
      state,
      action: PayloadAction<{
        removedOrderIds: number[];
        localStatuses: Record<number, { status: OrderStatus; statusLabel: string }>;
      }>
    ) => {
      state.removedOrderIds = action.payload.removedOrderIds;
      state.localStatuses = action.payload.localStatuses;
    },
    fetchOrdersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      const fromBackend = action.payload.filter((o) => !state.removedOrderIds.includes(o.id));
      const merged = fromBackend.map((o) => {
        const local = state.localStatuses[o.id];
        return local ? { ...o, status: local.status, statusLabel: local.statusLabel } : o;
      });
      const backendIds = new Set(merged.map((o) => o.id));
      const localOnly = state.orders.filter(
        (o) => !backendIds.has(o.id) && !state.removedOrderIds.includes(o.id)
      );
      state.orders = [...localOnly, ...merged];
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createOrderStart: (state) => {
      state.isCreating = true;
      state.error = null;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.isCreating = false;
      const exists = state.orders.some((o) => o.id === action.payload.id);
      if (!exists) {
        state.orders.unshift(action.payload);
        state.localStatuses[action.payload.id] = {
          status: action.payload.status,
          statusLabel: action.payload.statusLabel,
        };
      }
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.isCreating = false;
      state.error = action.payload;
    },
    updateOrderItems: (
      state,
      action: PayloadAction<{ orderId: number; items: Order['items']; totalAmount: number }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.items = action.payload.items;
        order.totalAmount = action.payload.totalAmount;
      }
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: number; status: OrderStatus; statusLabel: string }>
    ) => {
      const { orderId, status, statusLabel } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
        order.statusLabel = statusLabel;
      }
      state.localStatuses[orderId] = { status, statusLabel };
    },
    cancelOrderSuccess: (state, action: PayloadAction<number>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.status = 'cancelled';
        order.statusLabel = 'Отменён';
      }
      state.localStatuses[action.payload] = { status: 'cancelled', statusLabel: 'Отменён' };
    },
    confirmPickupSuccess: (state, action: PayloadAction<number>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.status = 'delivered';
        order.statusLabel = 'Выдан';
      }
      state.localStatuses[action.payload] = { status: 'delivered', statusLabel: 'Выдан' };
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      if (!state.removedOrderIds.includes(action.payload)) {
        state.removedOrderIds.push(action.payload);
      }
      delete state.localStatuses[action.payload];
    },

    setOrderLocalStart: (state, action: PayloadAction<number>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.localStartedAt = Date.now();
      }
    },
  },
});
