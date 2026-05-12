import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { OrdersState } from './types';

interface State {
  [name]: OrdersState;
}

const root = (state: State) => state[name];

const selectOrders = createSelector(root, (orders) => orders.orders);

export const selectors = {
  selectOrders,
};
