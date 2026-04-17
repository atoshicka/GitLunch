import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { MenuState } from './types';

interface State {
  [name]: MenuState;
}

const root = (state: State) => state[name];

const selectDishes = createSelector(root, (s) => s.dishes);
const selectFilteredDishes = createSelector(root, (s) => s.filteredDishes);
const selectCategories = createSelector(root, (s) => s.categories);
const selectSelectedFilter = createSelector(root, (s) => s.selectedFilter);
const selectMenuIsLoading = createSelector(root, (s) => s.isLoading);
const selectMenuError = createSelector(root, (s) => s.error);

export const selectors = {
  selectDishes,
  selectFilteredDishes,
  selectCategories,
  selectSelectedFilter,
  selectMenuIsLoading,
  selectMenuError,
};
