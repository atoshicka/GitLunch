import { watchMenu } from './menu-saga';
import {
  selectCategories,
  selectDishes,
  selectFilteredDishes,
  selectMenuError,
  selectMenuIsLoading,
  selectSelectedFilter,
} from './menu-selectors';
import menuReducer, {
  fetchCategoriesSuccess,
  fetchDishesFailure,
  fetchDishesStart,
  fetchDishesSuccess,
  setFilteredDishes,
  setSelectedFilter,
} from './menu-slice';

export const MenuFeature = {
  reducer: { menu: menuReducer },
  sagas: { watchMenu },
  selectors: {
    selectDishes,
    selectFilteredDishes,
    selectCategories,
    selectSelectedFilter,
    selectMenuIsLoading,
    selectMenuError,
  },
  actions: {
    fetchDishes: fetchDishesStart,
    fetchDishesSuccess,
    fetchDishesFailure,
    fetchCategoriesSuccess,
    setFilteredDishes,
    setSelectedFilter,
  },
};
