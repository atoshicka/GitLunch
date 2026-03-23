import { createSelector } from '@reduxjs/toolkit';
import { HOME_SLICE_NAME } from './slice';
import { HomeState } from './types';

interface State {
  [HOME_SLICE_NAME]: HomeState;
}

const root = (state: State) => state[HOME_SLICE_NAME];

export const selectRestaurants = createSelector(root, (home) => home.restaurants);
export const selectPromoDishes = createSelector(root, (home) => home.promoDishes);
export const selectCurrentRestaurantIndex = createSelector(
  root,
  (home) => home.currentRestaurantIndex
);
export const selectIsLoading = createSelector(root, (home) => home.isLoading);
export const selectError = createSelector(root, (home) => home.error);
export const selectCurrentRestaurant = createSelector(
  selectRestaurants,
  selectCurrentRestaurantIndex,
  (restaurants, index) => restaurants[index] || null
);
