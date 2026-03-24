import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PromoDish, Restaurant } from '../../entities/api/types/home-types';
import { HomeState } from './types';

const initialState: HomeState = {
  restaurants: [],
  promoDishes: [],
  currentRestaurantIndex: 0,
  isLoading: false,
  error: null,
};

export const { name, actions, reducer } = createSlice({
  name: 'home',
  initialState,
  reducers: {
    fetchRestaurants: () => {},
    fetchRestaurantsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRestaurantsSuccess: (state, action: PayloadAction<Restaurant[]>) => {
      state.isLoading = false;
      state.restaurants = action.payload;
    },
    fetchRestaurantsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchPromoDishesSuccess: (state, action: PayloadAction<PromoDish[]>) => {
      state.promoDishes = action.payload;
    },
    setCurrentRestaurant: (state, action: PayloadAction<number>) => {
      state.currentRestaurantIndex = action.payload;
    },
  },
});
