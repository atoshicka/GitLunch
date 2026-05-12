import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { MenuState } from './types';

interface State {
  [name]: MenuState;
}

const root = (state: State) => state[name];

const selectDishes = createSelector(root, (menu) => menu.dishes);
const selectFilteredDishes = createSelector(root, (menu) => menu.filteredDishes);
const selectCategories = createSelector(root, (menu) => menu.categories);
const selectSelectedFilter = createSelector(root, (menu) => menu.selectedFilter);
const selectMenuIsLoading = createSelector(root, (menu) => menu.isLoading);
const selectMenuError = createSelector(root, (menu) => menu.error);

export const selectors = {
  selectDishes,
  selectFilteredDishes,
  selectCategories,
  selectSelectedFilter,
  selectMenuIsLoading,
  selectMenuError,
};
