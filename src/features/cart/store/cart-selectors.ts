import { RootState } from '../../../app/store';
import { CartItem } from '../../../entities/api/types/cart-types';

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

export const selectCartTotalItems = (state: RootState) =>
  state.cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

export const selectCartItemById = (id: string) => (state: RootState) =>
  state.cart.items.find((item: CartItem) => item.id === id);
