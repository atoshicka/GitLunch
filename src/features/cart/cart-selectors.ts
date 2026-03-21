import { RootState } from '../../app/store';
import { CartItem } from './types';

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;

export const selectCartTotalItems = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectCartItemById =
  (id: string) =>
  (state: RootState): CartItem | null =>
    state.cart.items.find((item) => item.id === id) ?? null;
