import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { DishModalState } from './types';

interface State {
  [name]: DishModalState;
}

const root = (state: State) => state[name];

const selectIsOpen = createSelector(root, (modal) => modal.isOpen);
const selectDishId = createSelector(root, (modal) => modal.dishId);
const selectDish = createSelector(root, (modal) => modal.dish);
const selectIsLoading = createSelector(root, (modal) => modal.isLoading);
const selectError = createSelector(root, (modal) => modal.error);

export const selectors = {
  selectIsOpen,
  selectDishId,
  selectDish,
  selectIsLoading,
  selectError,
};
