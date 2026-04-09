import { createSelector } from '@reduxjs/toolkit';
import { Weekday } from '../../entities/api/types/menu-types';
import { name } from './slice';
import { CartItem, CartState } from './types';

interface State {
  [name]: CartState;
}

const root = (state: State) => state[name];

const selectCartItems = createSelector(root, (cart) => cart.items);
const selectCartWeekdayGroups = createSelector(root, (cart) => cart.weekdayGroups);
const selectSelectedWeekdays = createSelector(root, (cart) => cart.selectedWeekdays);
const selectCartLoading = createSelector(root, (cart) => cart.loading);
const selectCartError = createSelector(root, (cart) => cart.error);
const selectCartInitialized = createSelector(root, (cart) => cart.initialized);

const selectCartTotalItems = createSelector(root, (cart) =>
  cart.items.reduce((sum, item) => sum + item.quantity, 0)
);

const selectCartTotalPrice = createSelector(
  selectCartItems,
  selectSelectedWeekdays,
  (items: CartItem[], selectedWeekdays: Weekday[]) =>
    items
      .filter((i) => !i.weekday || selectedWeekdays.includes(i.weekday))
      .reduce((sum, i) => sum + i.price * i.quantity, 0)
);

const selectCartItemById = (id: string) =>
  createSelector(
    selectCartItems,
    (items): CartItem | null => items.find((i) => i.id === id) ?? null
  );

export const selectors = {
  selectCartItems,
  selectCartWeekdayGroups,
  selectSelectedWeekdays,
  selectCartLoading,
  selectCartError,
  selectCartInitialized,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartItemById,
};
