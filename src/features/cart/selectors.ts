import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { CartItem, CartState } from './types';

interface State {
  [name]: CartState;
}

const root = (state: State) => state[name];

const selectCartItems = createSelector(root, (cart) => cart.items);
const selectCartLoading = createSelector(root, (cart) => cart.loading);
const selectCartError = createSelector(root, (cart) => cart.error);
const selectCartTotalItems = createSelector(root, (cart) =>
  cart.items.reduce((sum, item) => sum + item.quantity, 0)
);
const selectCartTotalPrice = createSelector(root, (cart) =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const selectCartItemById = (id: string) =>
  createSelector(
    selectCartItems,
    (items): CartItem | null => items.find((i) => i.id === id) ?? null
  );

export const selectors = {
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartItemById,
};
