import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Dish } from '../../entities/api/types/menu-types';
import { MenuState } from './types';

const initialState: MenuState = {
  dishes: [],
  categories: [],
  isLoading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    fetchDishesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDishesSuccess: (state, action: PayloadAction<Dish[]>) => {
      state.dishes = action.payload;
      state.isLoading = false;
    },
    fetchDishesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const MENU_SLICE_NAME = menuSlice.name;

export const { fetchDishesStart, fetchDishesSuccess, fetchDishesFailure, fetchCategoriesSuccess } =
  menuSlice.actions;

export default menuSlice.reducer;
