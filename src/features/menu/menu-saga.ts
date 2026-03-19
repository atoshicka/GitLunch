import { PayloadAction } from '@reduxjs/toolkit';
import { call, getContext, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { Dish } from '../../entities/api/types/menu-types';
import { selectDishes, selectSelectedFilter } from './menu-selectors';
import {
  fetchCategoriesSuccess,
  fetchDishesFailure,
  fetchDishesStart,
  fetchDishesSuccess,
  MENU_SLICE_NAME,
  setFilteredDishes,
  setSelectedFilter,
} from './menu-slice';

interface Category {
  id: number;
  name: string;
}

const dishMatchesCategory = (dish: Dish, categoryName: string): boolean => {
  if (dish.categories && dish.categories.length > 0) {
    return dish.categories.some((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
  }
  return dish.category?.name?.toLowerCase() === categoryName.toLowerCase();
};

function* fetchDishesSaga() {
  try {
    const apiService: ApiService = yield getContext('apiService');
    yield put(fetchDishesStart());

    const dishes: Dish[] = yield call([apiService, apiService.getDishes]);
    yield put(fetchDishesSuccess(dishes));

    const categories: Category[] = yield call([apiService, apiService.getCategories]);
    yield put(fetchCategoriesSuccess(categories));

    yield call(filterDishesSaga);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки меню';
    yield put(fetchDishesFailure(errorMessage));
  }
}

function* filterDishesSaga() {
  try {
    const dishes: Dish[] = yield select(selectDishes);
    const selectedFilter: string = yield select(selectSelectedFilter);

    if (!selectedFilter || selectedFilter === 'Все') {
      yield put(setFilteredDishes(dishes));
      return;
    }

    const filtered = dishes.filter((dish: Dish) => dishMatchesCategory(dish, selectedFilter));
    yield put(setFilteredDishes(filtered));
  } catch (error: unknown) {
    console.error('Ошибка фильтрации блюд:', error);
    yield put(setFilteredDishes([]));
  }
}

function* handleFilterChangeSaga(action: PayloadAction<string>) {
  yield put(setSelectedFilter(action.payload));
  yield call(filterDishesSaga);
}

export function* watchMenu() {
  yield takeLatest(`${MENU_SLICE_NAME}/fetchDishes`, fetchDishesSaga);
  yield takeLatest(`${MENU_SLICE_NAME}/changeFilter`, handleFilterChangeSaga);
}
