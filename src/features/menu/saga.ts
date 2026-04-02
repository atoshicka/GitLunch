import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { Category, Dish } from '../../entities/api/types/menu-types';
import { selectors } from './selectors';
import { actions } from './slice';

const dishMatchesCategory = (dish: Dish, categoryName: string): boolean => {
  if (dish.categories && dish.categories.length > 0) {
    return dish.categories.some((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
  }
  return dish.category?.name?.toLowerCase() === categoryName.toLowerCase();
};

function* filterDishesSaga() {
  const dishes: Dish[] = yield select(selectors.selectDishes);
  const selectedFilter: string = yield select(selectors.selectSelectedFilter);

  if (!selectedFilter || selectedFilter === 'Все') {
    yield put(actions.setFilteredDishes(dishes));
    return;
  }

  const filtered = dishes.filter((dish) => dishMatchesCategory(dish, selectedFilter));
  yield put(actions.setFilteredDishes(filtered));
}

function* fetchDishesSaga(apiService: ApiService) {
  try {
    yield put(actions.fetchDishesStart());

    const dishes: Dish[] = yield call([apiService, apiService.getDishes]);
    yield put(actions.fetchDishesSuccess(dishes));

    const categories: Category[] = yield call([apiService, apiService.getCategories]);
    yield put(actions.fetchCategoriesSuccess(categories));

    yield call(filterDishesSaga);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка загрузки меню';
    yield put(actions.fetchDishesFailure(message));
  }
}

function* handleFilterChangeSaga(action: PayloadAction<string>) {
  yield put(actions.setSelectedFilter(action.payload));
  yield call(filterDishesSaga);
}

export function* watchMenu(apiService: ApiService) {
  yield takeLatest(actions.fetchDishes.type, fetchDishesSaga, apiService);
  yield takeLatest(actions.changeFilter.type, handleFilterChangeSaga);
}
