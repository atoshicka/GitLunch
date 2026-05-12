import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { HomeState } from './types';

interface State {
  [name]: HomeState;
}

const root = (state: State) => state[name];

const selectRestaurants = createSelector(root, (home) => home.restaurants);
const selectPromoDishes = createSelector(root, (home) => home.promoDishes);
const selectCurrentRestaurantIndex = createSelector(root, (home) => home.currentRestaurantIndex);
const selectIsLoading = createSelector(root, (home) => home.isLoading);
const selectError = createSelector(root, (home) => home.error);
const selectCurrentRestaurant = createSelector(
  selectRestaurants,
  selectCurrentRestaurantIndex,
  (restaurants, index) => restaurants[index] ?? null
);

export const selectors = {
  selectRestaurants,
  selectPromoDishes,
  selectCurrentRestaurantIndex,
  selectCurrentRestaurant,
  selectIsLoading,
  selectError,
};
