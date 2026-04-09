import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { DishModalState } from './types';

interface State {
  [name]: DishModalState;
}

const root = (state: State) => state[name];

const selectIsOpen = createSelector(root, (s) => s.isOpen);
const selectDishId = createSelector(root, (s) => s.dishId);
const selectDish = createSelector(root, (s) => s.dish);
const selectIsLoading = createSelector(root, (s) => s.isLoading);
const selectError = createSelector(root, (s) => s.error);

export const selectors = {
  selectIsOpen,
  selectDishId,
  selectDish,
  selectIsLoading,
  selectError,
};
