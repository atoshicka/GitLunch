// features/orders/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateOrderPayload, OrderStatus } from '../../entities/api/types/order-types';
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
    fetchOrderDetails: (_state, _action: PayloadAction<number>) => {},
    createOrder: (_state, _action: PayloadAction<CreateOrderPayload>) => {},
    confirmPickup: (_state, _action: PayloadAction<number>) => {},
    pollOrderStatus: (_state, _action: PayloadAction<number>) => {},

    // Восстановление из AsyncStorage
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

    // Загрузка списка заказов
    fetchOrdersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      const fromBackend = action.payload.filter((o) => !state.removedOrderIds.includes(o.id));
      const backendIds = new Set(fromBackend.map((o) => o.id));
      const localOnly = state.orders.filter(
        (o) => !backendIds.has(o.id) && !state.removedOrderIds.includes(o.id)
      );
      state.orders = [...localOnly, ...fromBackend];
      for (const order of fromBackend) {
        delete state.localStatuses[order.id];
      }
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Загрузка деталей заказа
    fetchOrderDetailsStart: (state) => {
      state.error = null;
    },
    fetchOrderDetailsSuccess: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    fetchOrderDetailsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Создание заказа
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

    // Обновление состава заказа
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

    // Обновление статуса (только от бэка через polling)
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

    // Подтверждение получения
    confirmPickupSuccess: (state, action: PayloadAction<number>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.status = 'delivered';
        order.statusLabel = 'Выдан';
      }
      state.localStatuses[action.payload] = { status: 'delivered', statusLabel: 'Выдан' };
    },

    // Ошибка подтверждения
    confirmPickupFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Удаление из списка
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
