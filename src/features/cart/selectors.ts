import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { CartItem, CartState } from './types';

interface State {
  [name]: CartState;
}

const root = (state: State) => state[name];

const selectDayGroups = createSelector(root, (cart) => cart.dayGroups);
const selectCartLoading = createSelector(root, (cart) => cart.loading);
const selectCartError = createSelector(root, (cart) => cart.error);
const selectCartInitialized = createSelector(root, (cart) => cart.initialized);

const selectAllItems = createSelector(selectDayGroups, (groups): CartItem[] =>
  groups.flatMap((g) => g.items)
);

const selectTotalItemsCount = createSelector(selectAllItems, (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0)
);

const selectTotalPrice = createSelector(selectDayGroups, (groups) =>
  groups.filter((g) => g.selected).reduce((sum, g) => sum + g.total, 0)
);

const selectSelectedDates = createSelector(selectDayGroups, (groups) =>
  groups.filter((g) => g.selected).map((g) => g.date)
);

const selectCartItemById = (id: string) =>
  createSelector(
    selectAllItems,
    (items): CartItem | null => items.find((i) => i.id === id) ?? null
  );

export const selectors = {
  selectDayGroups,
  selectCartLoading,
  selectCartError,
  selectCartInitialized,
  selectAllItems,
  selectTotalItemsCount,
  selectTotalPrice,
  selectSelectedDates,
  selectCartItemById,
};
