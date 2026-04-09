import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Dish } from '../../entities/api/types/menu-types';
import { MenuState, WeekdayGroup } from './types';

const initialState: MenuState = {
  dishes: [],
  filteredDishes: [],
  weekdayGroups: [],
  categories: [],
  selectedFilter: 'Все',
  isLoading: false,
  error: null,
};

export const { name, actions, reducer } = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    fetchDishes: () => {},
    changeFilter: (_state, _action: PayloadAction<string>) => {},
    fetchDishesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDishesSuccess: (state, action: PayloadAction<Dish[]>) => {
      state.isLoading = false;
      state.dishes = action.payload;
      state.filteredDishes = action.payload;
    },
    fetchDishesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setFilteredDishes: (state, action: PayloadAction<Dish[]>) => {
      state.filteredDishes = action.payload;
    },
    setSelectedFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilter = action.payload;
    },
    setWeekdayGroups: (state, action: PayloadAction<WeekdayGroup[]>) => {
      state.weekdayGroups = action.payload;
    },
  },
});
