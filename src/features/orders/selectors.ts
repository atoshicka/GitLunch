import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { Order, OrdersState } from './types';

interface State {
  [name]: OrdersState;
}

const root = (state: State) => state[name];

const selectRawOrders = createSelector(root, (rootData) => rootData.orders);
const selectIsLoading = createSelector(root, (rootData) => rootData.isLoading);
const selectIsCreating = createSelector(root, (rootData) => rootData.isCreating);
const selectError = createSelector(root, (rootData) => rootData.error);
const selectLastSyncAt = createSelector(root, (rootData) => rootData.lastSyncAt);

const selectOrders = createSelector(selectRawOrders, (orders): Order[] => {
  return [...orders].sort((a, b) => {
    const priority = { pending: 0, ready: 1, delivered: 2 };
    return priority[a.status] - priority[b.status];
  });
});

const selectActiveOrders = createSelector(selectOrders, (orders) =>
  orders.filter((o) => o.status === 'pending' || o.status === 'ready')
);

const selectOrderById = (id: number) =>
  createSelector(selectOrders, (orders) => orders.find((o) => o.id === id) ?? null);

export const selectors = {
  selectOrders,
  selectActiveOrders,
  selectIsLoading,
  selectIsCreating,
  selectError,
  selectOrderById,
  selectLastSyncAt,
};
