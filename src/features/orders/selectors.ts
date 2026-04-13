import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { OrdersState } from './types';

interface State {
  [name]: OrdersState;
}

const root = (state: State) => state[name];

const selectOrders = createSelector(root, (s) => s.orders);
const selectIsLoading = createSelector(root, (s) => s.isLoading);
const selectIsCreating = createSelector(root, (s) => s.isCreating);
const selectError = createSelector(root, (s) => s.error);

const selectOrderById = (id: number) =>
  createSelector(selectOrders, (orders) => orders.find((o) => o.id === id) ?? null);

export const selectors = {
  selectOrders,
  selectIsLoading,
  selectIsCreating,
  selectError,
  selectOrderById,
};
