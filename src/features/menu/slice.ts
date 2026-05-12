import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Dish } from '../../entities/api/types/menu-types';
import { MenuDaySection, MenuState } from './types';

const initialState: MenuState = {
  dishes: [],
  filteredDishes: [],
  menuByDays: [],
  categories: [],
  selectedFilter: 'Все',
  isLoading: false,
  error: null,
};

export const {
  name,
  actions: sliceActions,
  reducer,
} = createSlice({
  name: 'menu',
  initialState,
  reducers: {
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
    setMenuByDays: (state, action: PayloadAction<MenuDaySection[]>) => {
      state.menuByDays = action.payload;
    },
    setFilteredDishes: (state, action: PayloadAction<Dish[]>) => {
      state.filteredDishes = action.payload;
    },
    setSelectedFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilter = action.payload;
    },
  },
});

export const fetchDishes = createAction('menu/fetchDishes');
export const changeFilter = createAction<string>('menu/changeFilter');

export const actions = {
  ...sliceActions,
  fetchDishes,
  changeFilter,
};
