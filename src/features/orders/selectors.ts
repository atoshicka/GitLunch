import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { OrdersState } from './types';

interface State {
  [name]: OrdersState;
}

const root = (state: State) => state[name];

const selectOrders = createSelector(root, (rootData) => rootData.orders);
const selectIsLoading = createSelector(root, (rootData) => rootData.isLoading);
const selectIsCreating = createSelector(root, (rootData) => rootData.isCreating);
const selectError = createSelector(root, (rootData) => rootData.error);

const selectOrderById = (id: number) =>
  createSelector(selectOrders, (orders) => orders.find((o) => o.id === id) ?? null);

export const selectors = {
  selectOrders,
  selectIsLoading,
  selectIsCreating,
  selectError,
  selectOrderById,
};
