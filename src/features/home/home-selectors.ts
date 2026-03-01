import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const selectHomeSlice = (state: RootState) => state.home;

export const selectRestaurants = createSelector([selectHomeSlice], (home) => home.restaurants);

export const selectPromoDishes = createSelector([selectHomeSlice], (home) => home.promoDishes);

export const selectCurrentRestaurantIndex = createSelector(
  [selectHomeSlice],
  (home) => home.currentRestaurantIndex
);

export const selectIsLoading = createSelector([selectHomeSlice], (home) => home.isLoading);

export const selectError = createSelector([selectHomeSlice], (home) => home.error);

export const selectCurrentRestaurant = createSelector(
  [selectRestaurants, selectCurrentRestaurantIndex],
  (restaurants, index) => restaurants[index] || null
);
