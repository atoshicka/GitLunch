import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantState } from './types';

const initialState: RestaurantState = {
  name: null,
  description: null,
};

export const { name, actions, reducer } = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurantName: (state, action: PayloadAction<string | null>) => {
      state.name = action.payload;
    },
    setRestaurantDescription: (state, action: PayloadAction<string | null>) => {
      state.description = action.payload;
    },
    fetchRestaurantProfile: () => {},
    resetRestaurant: () => initialState,
  },
});
