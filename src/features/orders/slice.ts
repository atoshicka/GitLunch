import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderStatus } from '../../entities/api/types/order-types';
import { CreateOrderPayload, Order, OrdersState } from './types';

const initialState: OrdersState = {
  orders: [],
  removedOrderIds: [],
  localStatuses: {},
  notifiedOrderIds: [],
  isLoading: false,
  isCreating: false,
  error: null,
  lastSyncAt: null,
};

export const {
  name,
  actions: sliceActions,
  reducer,
} = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    restorePersistedState: (
      state,
      action: PayloadAction<{
        removedOrderIds: number[];
        localStatuses: Record<number, { status: OrderStatus; statusLabel: string }>;
        notifiedOrderIds: number[];
        lastSyncAt: string | null;
      }>
    ) => {
      state.removedOrderIds = action.payload.removedOrderIds;
      state.localStatuses = action.payload.localStatuses;
      state.notifiedOrderIds = action.payload.notifiedOrderIds;
      state.lastSyncAt = action.payload.lastSyncAt;
    },

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

    updateOrderStatus: (
      state,
      action: PayloadAction<{
        orderId: number;
        status: OrderStatus;
        statusLabel: string;
        deliveryInfo?: string;
      }>
    ) => {
      const { orderId, status, statusLabel, deliveryInfo } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
        order.statusLabel = statusLabel;
        if (deliveryInfo !== undefined) {
          order.deliveryInfo = deliveryInfo;
        }
      }
      state.localStatuses[orderId] = { status, statusLabel };
    },

    markOrderAsNotified: (state, action: PayloadAction<number>) => {
      if (!state.notifiedOrderIds.includes(action.payload)) {
        state.notifiedOrderIds.push(action.payload);
      }
    },

    setLastSyncAt: (state, action: PayloadAction<string>) => {
      state.lastSyncAt = action.payload;
    },

    removeOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      if (!state.removedOrderIds.includes(action.payload)) {
        state.removedOrderIds.push(action.payload);
      }
      delete state.localStatuses[action.payload];
    },

    destroyAllOrdersSuccess: (state) => {
      state.orders = [];
      state.removedOrderIds = [];
      state.localStatuses = {};
      state.notifiedOrderIds = [];
      state.lastSyncAt = null;
    },
    destroyAllOrdersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    setOrderLocalStart: (state, action: PayloadAction<number>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.localStartedAt = Date.now();
      }
    },
  },
});

export const fetchOrders = createAction('orders/fetchOrders');
export const fetchOrderDetails = createAction<number>('orders/fetchOrderDetails');
export const createOrder = createAction<CreateOrderPayload>('orders/createOrder');
export const startGlobalPolling = createAction('orders/startGlobalPolling');
export const stopGlobalPolling = createAction('orders/stopGlobalPolling');
export const destroyAllOrders = createAction('orders/destroyAllOrders');

export const actions = {
  ...sliceActions,
  fetchOrders,
  fetchOrderDetails,
  createOrder,
  startGlobalPolling,
  stopGlobalPolling,
  destroyAllOrders,
};
