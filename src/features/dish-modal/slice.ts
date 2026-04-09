import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dish } from '../../entities/api/types/menu-types';
import { DishModalState } from './types';

const initialState: DishModalState = {
  isOpen: false,
  dishId: null,
  dish: null,
  isLoading: false,
  error: null,
};

export const { name, actions, reducer } = createSlice({
  name: 'dishModal',
  initialState,
  reducers: {
    openDishModal: (state, action: PayloadAction<number>) => {
      state.isOpen = true;
      state.dishId = action.payload;
      state.dish = null;
      state.error = null;
    },
    closeDishModal: (state) => {
      state.isOpen = false;
      state.dishId = null;
      state.dish = null;
      state.isLoading = false;
      state.error = null;
    },
    setIsLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setDish: (state, action: PayloadAction<Dish>) => {
      state.dish = action.payload;
      state.isLoading = false;
    },
    fetchDishFailure: (state) => {
      state.isLoading = false;
      state.error = 'Не удалось загрузить блюдо';
    },
  },
});
