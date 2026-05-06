import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { RestaurantState } from './types';

interface State {
  [name]: RestaurantState;
}

const root = (state: State) => state[name];

const selectRestaurantName = createSelector(root, (rootData) => rootData.name);
const selectRestaurantDescription = createSelector(root, (rootData) => rootData.description);

export const selectors = {
  selectRestaurantName,
  selectRestaurantDescription,
};
