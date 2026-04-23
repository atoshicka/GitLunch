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

const selectOrders = createSelector(selectRawOrders, (orders): Order[] => {
  return [...orders].sort((a, b) => {
    const aDelivered = a.status === 'delivered' ? 1 : 0;
    const bDelivered = b.status === 'delivered' ? 1 : 0;
    return aDelivered - bDelivered;
  });
});

const selectOrderById = (id: number) =>
  createSelector(selectOrders, (orders) => orders.find((o) => o.id === id) ?? null);

export const selectors = {
  selectOrders,
  selectIsLoading,
  selectIsCreating,
  selectError,
  selectOrderById,
};
