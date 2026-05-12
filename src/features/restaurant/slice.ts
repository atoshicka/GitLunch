import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BackendRestaurantProfile } from '../../entities/api/types/restaurant-types';
import { RestaurantState } from './types';

const initialState: RestaurantState = {
  name: null,
  description: null,
};

export const {
  name,
  actions: sliceActions,
  reducer,
} = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    fetchRestaurantProfileSuccess: (state, action: PayloadAction<BackendRestaurantProfile>) => {
      state.name = action.payload.name ?? null;
      state.description = action.payload.description ?? null;
    },
    resetRestaurant: () => initialState,
  },
});

export const fetchRestaurantProfile = createAction('restaurant/fetchRestaurantProfile');

export const actions = {
  ...sliceActions,
  fetchRestaurantProfile,
};
