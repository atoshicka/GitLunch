import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { MenuDaySection, MenuState } from './types';

interface State {
  [name]: MenuState;
}

const root = (state: State) => state[name];

const selectDishes = createSelector(root, (menu) => menu.dishes);
const selectFilteredDishes = createSelector(root, (menu) => menu.filteredDishes);
const selectMenuByDays = createSelector(root, (menu) => menu.menuByDays);
const selectCategories = createSelector(root, (menu) => menu.categories);
const selectSelectedFilter = createSelector(root, (menu) => menu.selectedFilter);
const selectMenuIsLoading = createSelector(root, (menu) => menu.isLoading);
const selectMenuError = createSelector(root, (menu) => menu.error);

const selectFilteredMenuByDays = createSelector(
  selectMenuByDays,
  selectSelectedFilter,
  (days, selectedFilter): MenuDaySection[] => {
    if (!selectedFilter || selectedFilter === 'Все') return days;
    return days
      .map((day) => ({
        ...day,
        dishes: day.dishes.filter((dish) => {
          if (dish.categories && dish.categories.length > 0) {
            return dish.categories.some(
              (cat) => cat.name.toLowerCase() === selectedFilter.toLowerCase()
            );
          }
          return dish.category?.name?.toLowerCase() === selectedFilter.toLowerCase();
        }),
      }))
      .filter((day) => day.dishes.length > 0);
  }
);

export const selectors = {
  selectDishes,
  selectFilteredDishes,
  selectMenuByDays,
  selectFilteredMenuByDays,
  selectCategories,
  selectSelectedFilter,
  selectMenuIsLoading,
  selectMenuError,
};
