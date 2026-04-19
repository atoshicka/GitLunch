import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { Category, Dish, MenuByDayResponse } from '../../entities/api/types/menu-types';
import { selectors } from './selectors';
import { actions } from './slice';
import { MenuDaySection } from './types';

function* filterDishesSaga() {
  const dishes: Dish[] = yield select(selectors.selectDishes);
  const selectedFilter: string = yield select(selectors.selectSelectedFilter);

  const filtered =
    !selectedFilter || selectedFilter === 'Все'
      ? dishes
      : dishes.filter((d) => {
          if (d.categories && d.categories.length > 0) {
            return d.categories.some(
              (cat) => cat.name.toLowerCase() === selectedFilter.toLowerCase()
            );
          }
          return d.category?.name?.toLowerCase() === selectedFilter.toLowerCase();
        });

  yield put(actions.setFilteredDishes(filtered));
}

function* fetchDishesSaga(apiService: ApiService) {
  try {
    yield put(actions.fetchDishesStart());

    const [raw, menuByDaysRaw, categories]: [Dish[], MenuByDayResponse[], Category[]] = yield all([
      call([apiService, apiService.getDishes]),
      call([apiService, apiService.getMenuByDays]),
      call([apiService, apiService.getCategories]),
    ]);

    yield put(actions.fetchDishesSuccess(raw));
    yield put(actions.fetchCategoriesSuccess(categories));

    const menuByDays: MenuDaySection[] = menuByDaysRaw
      .slice()
      .sort((a, b) => a.wday - b.wday)
      .map((entry) => ({
        day: entry.day,
        wday: entry.wday,
        dishes: entry.items,
      }));

    yield put(actions.setMenuByDays(menuByDays));
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
