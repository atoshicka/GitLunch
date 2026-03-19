import { createSelector } from '@reduxjs/toolkit';
import { MENU_SLICE_NAME } from './menu-slice';
import { MenuState } from './types';

interface State {
  [MENU_SLICE_NAME]: MenuState;
}

const root = (state: State) => state[MENU_SLICE_NAME];

export const selectDishes = createSelector(root, (menu) => menu.dishes);
export const selectFilteredDishes = createSelector(root, (menu) => menu.filteredDishes);
export const selectCategories = createSelector(root, (menu) => menu.categories);
export const selectSelectedFilter = createSelector(root, (menu) => menu.selectedFilter);
export const selectMenuIsLoading = createSelector(root, (menu) => menu.isLoading);
export const selectMenuError = createSelector(root, (menu) => menu.error);
