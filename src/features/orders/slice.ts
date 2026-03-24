import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrdersState } from './types';

const initialState: OrdersState = {
  orders: [],
};

export const { name, actions, reducer } = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
  },
});
