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

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setCurrentRestaurant: (state, action: PayloadAction<number>) => {
      state.currentRestaurantIndex = action.payload;
    },
    fetchRestaurantsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRestaurantsSuccess: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
      state.isLoading = false;
    },
    fetchRestaurantsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchPromoDishesSuccess: (state, action: PayloadAction<PromoDish[]>) => {
      state.promoDishes = action.payload;
    },
  },
});

export const {
  setCurrentRestaurant,
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
  fetchPromoDishesSuccess,
} = homeSlice.actions;

export default homeSlice.reducer;
